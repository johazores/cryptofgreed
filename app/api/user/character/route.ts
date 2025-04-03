import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Get the user's active character
    const character = await prisma.character.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      }
    });

    if (!character) {
      return new NextResponse(
        JSON.stringify({ message: "No active character found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("[CHARACTER_GET]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
} 