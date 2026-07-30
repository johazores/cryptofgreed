import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getStarterDeck } from "@/lib/cards";
import {
  getCharacterCreationError,
  isFightingStyle,
  normalizeCharacterName,
} from "@/lib/game/character-creation";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid character request" }, { status: 400 });
    }

    const { name, class: fightingStyle } = body as Record<string, unknown>;
    const rawName = typeof name === "string" ? name : "";
    const validationError = getCharacterCreationError(rawName, fightingStyle);

    if (validationError || !isFightingStyle(fightingStyle)) {
      return NextResponse.json(
        { message: validationError || "Choose a valid fighting style" },
        { status: 400 }
      );
    }

    const normalizedName = normalizeCharacterName(rawName);
    const existingCharacter = await prisma.character.findUnique({
      where: { name: normalizedName },
      select: { id: true },
    });

    if (existingCharacter) {
      return NextResponse.json(
        { message: "Character name already taken" },
        { status: 409 }
      );
    }

    const starterDeck = getStarterDeck(fightingStyle);
    const character = await prisma.character.create({
      data: {
        name: normalizedName,
        class: fightingStyle,
        userId: session.user.id,
        equipment: {
          create: {
            name: "Rusty Sword",
            description: "A worn starter weapon that still adds reliable damage.",
            slot: "WEAPON",
            tier: "T0",
            stats: { attack: 5 },
          },
        },
      },
      include: {
        equipment: true,
        powers: true,
      },
    });

    return NextResponse.json(
      {
        ...character,
        deck: starterDeck,
        hand: [],
        discardPile: [],
        block: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Character creation error:", error);
    return NextResponse.json(
      { message: "Failed to create character" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const characters = await prisma.character.findMany({
      where: { userId: session.user.id },
      include: { equipment: true, powers: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      characters.map((character) => ({
        ...character,
        hand: [],
        deck: [],
        discardPile: [],
        block: 0,
      }))
    );
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { message: "Failed to load characters" },
      { status: 500 }
    );
  }
}
