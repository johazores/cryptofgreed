import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

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

    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character || character.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Character not found" },
        { status: 404 }
      );
    }

    const deadCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        isDead: true,
        currentHealth: 0,
      },
      include: {
        equipment: true,
        powers: true,
      },
    });

    return NextResponse.json(deadCharacter);
  } catch (error) {
    console.error("Error handling character death:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
