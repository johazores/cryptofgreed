import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import GameClient from "./game";
import { ItemStats } from "@/types/character";

interface PageProps {
  params: { characterId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
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
        floor: character.level || 1,
        block: 0,
        deck: [],
        hand: [],
        discardPile: [],
        equipment: character.equipment.map((eq) => ({
          ...eq,
          stats: eq.stats as ItemStats, // Transform JsonValue to ItemStats
        })),
      }}
    />
  );
}
