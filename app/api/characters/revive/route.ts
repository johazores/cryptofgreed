import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

const REVIVE_COST = 100; // Crystal cost to revive

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { characterId } = await req.json();

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get user and verify crystal balance
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { crystals: true },
      });

      if (!user || user.crystals < REVIVE_COST) {
        throw new Error("Insufficient crystals");
      }

      // Get character and verify ownership
      const character = await tx.character.findUnique({
        where: { id: characterId },
      });

      if (!character || character.userId !== session.user.id) {
        throw new Error("Character not found or unauthorized");
      }

      // Deduct crystals from user
      await tx.user.update({
        where: { id: session.user.id },
        data: { crystals: user.crystals - REVIVE_COST },
      });

      // Revive character
      const revivedCharacter = await tx.character.update({
        where: { id: characterId },
        data: {
          isDead: false,
          currentHealth: character.maxHealth,
        },
      });

      return revivedCharacter;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error reviving character:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
