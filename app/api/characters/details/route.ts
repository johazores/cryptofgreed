import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { characterId } = await req.json();

    const character = await prisma.character.findUnique({
      where: {
        id: characterId,
        userId: session.user.id, // Ensure the character belongs to the user
      },
      include: {
        equipment: true,
        powers: true,
      },
    });

    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }

    // Add game-specific properties
    const enhancedCharacter = {
      ...character,
      deck: [],
      hand: [],
      discardPile: [],
      block: 0,
      floor: character.level || 1,
    };

    return NextResponse.json(enhancedCharacter);
  } catch (error) {
    console.error("Error fetching character details:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
