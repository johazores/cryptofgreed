import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { EquipmentSlot, ItemTier } from "@prisma/client";

interface EquipmentRequest {
  characterId: string;
  equipment: {
    name: string;
    description: string;
    slot: EquipmentSlot;
    tier: ItemTier;
    stats: {
      attack?: number;
      defense?: number;
      health?: number;
    };
    nftId: string;
    contractAddress: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { characterId, equipment }: EquipmentRequest = await req.json();

    // Verify character belongs to user
    const character = await prisma.character.findUnique({
      where: {
        id: characterId,
        userId: session.user.id,
      },
    });

    if (!character) {
      return new NextResponse("Character not found or unauthorized", {
        status: 401,
      });
    }

    // Create new equipment
    const newEquipment = await prisma.equipment.create({
      data: {
        name: equipment.name,
        description: equipment.description,
        slot: equipment.slot,
        tier: equipment.tier,
        stats: equipment.stats,
        characterId: characterId,
        nftId: equipment.nftId,
        contractAddress: equipment.contractAddress,
      },
    });

    return NextResponse.json(newEquipment);
  } catch (error) {
    console.error("Error creating equipment:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
