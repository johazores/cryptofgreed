import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { characterId, updates = {} } = await req.json();

    if (!characterId || typeof characterId !== "string") {
      return NextResponse.json(
        { message: "Character ID is required" },
        { status: 400 }
      );
    }

    if (
      updates === null ||
      typeof updates !== "object" ||
      Array.isArray(updates)
    ) {
      return NextResponse.json(
        { message: "Character updates must be an object" },
        { status: 400 }
      );
    }

    if (Object.prototype.hasOwnProperty.call(updates, "isDead")) {
      return NextResponse.json(
        { message: "Use the dedicated death or revival endpoint" },
        { status: 400 }
      );
    }

    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character || character.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }

    let newLevel = character.level;
    if (updates.experience !== undefined) {
      newLevel = Math.floor(updates.experience / 100) + 1;
    }

    const newMaxHealth = 100 + (newLevel - 1) * 20;

    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        gold: updates.gold ?? character.gold,
        experience: updates.experience ?? character.experience,
        currentHealth: updates.currentHealth ?? character.currentHealth,
        monstersSlain: updates.monstersSlain ?? character.monstersSlain,
        floor: updates.floor ?? character.floor,
        level: newLevel,
        maxHealth: newMaxHealth,
        ...(newLevel > character.level && {
          currentHealth: newMaxHealth,
        }),
      },
      include: {
        equipment: true,
        powers: true,
      },
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error("Error updating character:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
