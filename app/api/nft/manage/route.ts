import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WalletService } from "@/lib/wallet";
import { decrypt } from "@/lib/encryption";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's NFTs from both wallets
    const bankItems = await prisma.bankItem.findMany({
      where: { userId: session.user.id },
    });

    // Get external wallet NFTs using ethers
    const walletService = new WalletService();
    const externalNFTs = await walletService.getNFTs(
      session.user.walletAddress || ""
    );

    return NextResponse.json({
      custodialNFTs: bankItems,
      externalNFTs,
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
