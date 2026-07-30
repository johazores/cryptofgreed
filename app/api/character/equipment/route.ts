import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { EquipmentSlot, ItemTier } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { findShopItem } from "@/lib/game/shop";

class PurchaseError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Invalid purchase request" },
        { status: 400 }
      );
    }

    const { characterId, itemId } = body as Record<string, unknown>;
    if (typeof characterId !== "string" || typeof itemId !== "string") {
      return NextResponse.json(
        { message: "Character and item are required" },
        { status: 400 }
      );
    }

    const updatedCharacter = await prisma.$transaction(async (tx) => {
      const character = await tx.character.findFirst({
        where: { id: characterId, userId: session.user.id },
      });

      if (!character) {
        throw new PurchaseError("Character not found", 404);
      }

      if (character.isDead) {
        throw new PurchaseError("A fallen character cannot purchase items", 409);
      }

      const item = findShopItem(character.floor, itemId);
      if (!item) {
        throw new PurchaseError("This item is not available on the current floor", 400);
      }

      if (character.gold < item.price) {
        throw new PurchaseError("Not enough gold", 400);
      }

      await tx.equipment.deleteMany({
        where: {
          characterId: character.id,
          slot: item.slot as EquipmentSlot,
        },
      });

      await tx.equipment.create({
        data: {
          name: item.name,
          description: item.description,
          slot: item.slot as EquipmentSlot,
          tier: item.tier as ItemTier,
          stats: item.stats,
          characterId: character.id,
        },
      });

      return tx.character.update({
        where: { id: character.id },
        data: { gold: { decrement: item.price } },
        include: { equipment: true, powers: true },
      });
    });

    return NextResponse.json(updatedCharacter);
  } catch (error) {
    if (error instanceof PurchaseError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    console.error("Equipment purchase failed:", error);
    return NextResponse.json(
      { message: "Failed to purchase equipment" },
      { status: 500 }
    );
  }
}
