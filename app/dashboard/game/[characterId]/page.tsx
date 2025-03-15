import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import GameClient from "./game";

export default async function Page({
  params,
}: {
  params: { characterId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const character = await prisma.character.findUnique({
    where: {
      id: params.characterId,
      userId: session.user.id,
    },
    include: {
      equipment: true,
      powers: true,
    },
  });

  if (!character) {
    redirect("/dashboard");
  }

  return (
    <GameClient
      initialCharacter={{
        ...character,
        block: 0,
        deck: [],
        hand: [],
        discardPile: [],
      }}
    />
  );
}
