import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { WalletService } from "@/lib/wallet";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const { tokenId } = await req.json();
  const walletService = new WalletService();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      walletAddress: true,
      custodialWalletAddress: true,
      encryptedPrivateKey: true,
    },
  });

  await walletService.transferNFT(
    tokenId,
    user!.walletAddress!,
    user!.custodialWalletAddress,
    user!.encryptedPrivateKey
  );

  await prisma.bankItem.create({
    data: {
      name: "NFT Item", // You may want to get this from the NFT metadata
      description: "Deposited NFT", // You may want to get this from the NFT metadata
      slot: "WEAPON", // You should specify the correct slot type from EquipmentSlot enum
      tier: "T0", // You should specify the correct tier from ItemTier enum
      stats: {}, // You should include the actual stats from the NFT
      userId: session.user.id,
      nftId: tokenId,
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    },
  });

  return NextResponse.json({ success: true });
}
