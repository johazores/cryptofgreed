import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const bankItems = await prisma.bankItem.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        contractAddress: true,
        nftId: true,
        name: true,
        description: true, // Using an existing field from the schema instead
      },
    });

    return NextResponse.json(bankItems);
  } catch (error) {
    console.error("Error fetching bank items:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
