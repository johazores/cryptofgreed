import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import {
  getRevivalBlockReason,
  REVIVE_COST,
} from "@/lib/game/revival";

class ReviveRouteError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await req.json();
    if (!characterId || typeof characterId !== "string") {
      return NextResponse.json(
        { message: "Character ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const character = await tx.character.findUnique({
        where: { id: characterId },
      });

      if (!character || character.userId !== session.user.id) {
        throw new ReviveRouteError("Character not found", 404);
      }

      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { crystals: true },
      });

      if (!user) {
        throw new ReviveRouteError("User not found", 404);
      }

      const blockReason = getRevivalBlockReason(
        character.isDead,
        user.crystals
      );

      if (blockReason === "CHARACTER_ALREADY_ALIVE") {
        throw new ReviveRouteError("Character is already alive", 409);
      }

      if (blockReason === "INSUFFICIENT_CRYSTALS") {
        throw new ReviveRouteError("Insufficient crystals", 400);
      }

      const crystalsRemaining = user.crystals - REVIVE_COST;

      await tx.user.update({
        where: { id: session.user.id },
        data: { crystals: crystalsRemaining },
      });

      const revivedCharacter = await tx.character.update({
        where: { id: characterId },
        data: {
          isDead: false,
          currentHealth: character.maxHealth,
        },
        include: {
          equipment: true,
          powers: true,
        },
      });

      return {
        character: revivedCharacter,
        crystalsRemaining,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error reviving character:", error);

    if (error instanceof ReviveRouteError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
