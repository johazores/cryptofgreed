import { WalletService } from "@/lib/wallet";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export async function handleCharacterDeath(
  characterId: string,
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { encryptedPrivateKey: true },
  });

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { equipment: true },
  });

  if (!character) return;

  const privateKey = await decrypt(user!.encryptedPrivateKey);
  const walletService = new WalletService();

  // Burn all equipped NFTs
  for (const item of character.equipment) {
    await walletService.burnNFT(item.nftId, privateKey);
  }

  // Clear character equipment
  await prisma.equipment.deleteMany({
    where: { characterId },
  });
}
