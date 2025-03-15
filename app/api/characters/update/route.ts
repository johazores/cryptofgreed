import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
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

    // Update character stats
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        gold: updates.gold ?? character.gold,
        experience: updates.experience ?? character.experience,
        currentHealth: updates.currentHealth ?? character.currentHealth,
        isDead: updates.isDead ?? character.isDead,
      },
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    console.error("Error updating character:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
