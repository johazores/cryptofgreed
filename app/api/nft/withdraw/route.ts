import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WalletService } from "@/lib/wallet";
import { decrypt } from "@/lib/encryption";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { bankItemId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        walletAddress: true,
        custodialWalletAddress: true,
        encryptedPrivateKey: true,
      },
    });

    if (!user?.walletAddress) {
      return new NextResponse("No external wallet connected", { status: 400 });
    }

    const bankItem = await prisma.bankItem.findUnique({
      where: { id: bankItemId },
    });

    if (!bankItem || bankItem.userId !== session.user.id) {
      return new NextResponse("Item not found", { status: 404 });
    }

    // Transfer NFT
    const walletService = new WalletService();
    const privateKey = await decrypt(user.encryptedPrivateKey);

    await walletService.transferNFT(
      bankItem.contractAddress,
      bankItem.nftId,
      user.custodialWalletAddress,
      user.walletAddress,
      privateKey
    );

    // Remove bank item
    await prisma.bankItem.delete({
      where: { id: bankItemId },
    });

    return NextResponse.json({ message: "NFT withdrawn successfully" });
  } catch (error) {
    console.error("NFT withdrawal error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
