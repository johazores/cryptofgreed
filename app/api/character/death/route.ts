import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WalletService } from "@/lib/wallet";
import { decrypt } from "@/lib/encryption";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { characterId } = await req.json();

    await prisma.$transaction(async (tx) => {
      const character = await tx.character.findUnique({
        where: { id: characterId },
        include: { equipment: true },
      });

      if (!character) throw new Error("Character not found");

      const user = await tx.user.findUnique({
        where: { id: character.userId },
        select: { encryptedPrivateKey: true },
      });

      if (user?.encryptedPrivateKey) {
        const walletService = new WalletService();

        // Burn all equipped NFTs
        for (const item of character.equipment) {
          await walletService.burnNFT(item.contractAddress, item.nftId);
        }
      }

      // Clear character equipment
      await tx.equipment.deleteMany({
        where: { characterId: character.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling character death:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
