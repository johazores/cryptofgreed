import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { walletAddress } = (await req.json()) as {
      walletAddress: string | null;
    };

    // Allow null wallet address for disconnecting
    if (walletAddress === null) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { walletAddress: null },
      });
      return NextResponse.json({
        message: "Wallet address cleared successfully",
      });
    }

    // Check if wallet address is already in use
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existingUser && existingUser.email !== session.user.email) {
      return new NextResponse("Wallet address already in use", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { walletAddress },
    });

    return NextResponse.json({
      message: "Wallet address updated successfully",
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error("Error updating wallet address:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
