import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStarterDeck } from "@/lib/cards";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, class: fightingStyle } = await req.json();

    // Validate input
    if (!name || !fightingStyle) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if name is taken
    const existingCharacter = await prisma.character.findUnique({
      where: { name },
    });

    if (existingCharacter) {
      return new NextResponse("Character name already taken", { status: 400 });
    }

    // Get starter deck for the character's class
    const starterDeck = getStarterDeck(fightingStyle);

    // Create character with starter equipment and deck
    const character = await prisma.character.create({
      data: {
        name,
        class: fightingStyle,
        userId: session.user.id,
        equipment: {
          create: {
            name: "Rusty Sword",
            description: "A basic sword, slightly rusty but still sharp",
            slot: "WEAPON",
            tier: "T0",
            stats: { damage: 5 },
            nftId: "starter-sword-001",
          },
        },
      },
      include: {
        equipment: true,
      },
    });

    // Add deck, hand, and discard pile to the response
    const enhancedCharacter = {
      ...character,
      deck: starterDeck,
      hand: [],
      discardPile: [],
      block: 0,
    };

    return NextResponse.json(enhancedCharacter);
  } catch (error) {
    console.error("Character creation error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}

// Get user's characters
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const characters = await prisma.character.findMany({
      where: { userId: session.user.id },
      include: {
        equipment: true,
        powers: true,
      },
    });

    // Add card-related properties to each character
    const enhancedCharacters = characters.map((character) => ({
      ...character,
      hand: [],
      deck: [],
      discardPile: [],
      block: 0,
    }));

    return NextResponse.json(enhancedCharacters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
