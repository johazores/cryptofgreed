import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params?.id) {
      return new NextResponse("Character ID is required", { status: 400 });
    }

    const character = await prisma.character.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        equipment: true,
        powers: true,
      },
    });

    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("Error fetching character:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
