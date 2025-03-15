"use client";
import NFTManager from "@/components/nft/nft-manager";
import WalletManager from "@/components/wallet/wallet-manager";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function WalletPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-medievalsharp mb-8">Wallet & NFTs</h1>

      <div className="grid grid-cols-1 gap-8">
        <WalletManager />
        <NFTManager />
      </div>
    </div>
  );
}
