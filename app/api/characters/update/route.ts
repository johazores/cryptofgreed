import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { characterId, updates } = await req.json();

    // Verify character belongs to user
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character || character.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Calculate new level if experience is being updated
    let newLevel = character.level;
    if (updates.experience !== undefined) {
      // Calculate new level based on total experience
      newLevel = Math.floor(updates.experience / 100) + 1;
    }

    // Calculate new maxHealth based on level
    const baseHealth = 100;
    const healthPerLevel = 20;
    const newMaxHealth = baseHealth + (newLevel - 1) * healthPerLevel;

    // Update character stats
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        gold: updates.gold ?? character.gold,
        experience: updates.experience ?? character.experience,
        currentHealth: updates.currentHealth ?? character.currentHealth,
        isDead: updates.isDead ?? character.isDead,
        monstersSlain: updates.monstersSlain ?? character.monstersSlain, // Make sure this is included
        floor: updates.floor ?? character.floor, // Make sure floor is included too
        level: newLevel,
        maxHealth: newMaxHealth,
        // If leveling up, restore health to new max
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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
