import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { contractAddress, tokenId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        walletAddress: true,
        custodialWalletAddress: true,
      },
    });

    if (!user?.walletAddress) {
      return new NextResponse("No external wallet connected", { status: 400 });
    }

    // Create bank item entry
    await prisma.bankItem.create({
      data: {
        userId: session.user.id,
        nftId: tokenId,
        contractAddress,
        name: "NFT Item", // TODO: Fetch metadata from contract
        description: "NFT Description",
        slot: "WEAPON", // TODO: Determine from metadata
        tier: "T1",
        stats: { damage: 10 }, // TODO: Calculate from metadata
      },
    });

    return NextResponse.json({ message: "NFT deposited successfully" });
  } catch (error) {
    console.error("NFT deposit error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
