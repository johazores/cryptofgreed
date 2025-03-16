import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NFTGrid from "./nft-grid";
import TransferModal from "./transfer-modal";
import { toast } from "sonner";

interface NFT {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
}

export default function WalletDashboard() {
  const { data: session } = useSession();
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Custodial wallet NFTs
  const [custodialNFTs, setCustodialNFTs] = useState<NFT[]>([]);
  // External wallet NFTs
  const [externalNFTs, setExternalNFTs] = useState<NFT[]>([]);

  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/nft/manage");
      if (!response.ok) throw new Error("Failed to fetch NFTs");

      const data = await response.json();
      setCustodialNFTs(data.custodialNFTs);
      setExternalNFTs(data.externalNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error("Failed to load NFTs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNFTs();
    }
  }, [session]);

  const handleDeposit = async (nft: NFT) => {
    const response = await fetch("/api/nft/deposit", {
      method: "POST",
      body: JSON.stringify({
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
      }),
    });
  };

  const handleWithdraw = async (nft: NFT) => {
    const response = await fetch("/api/nft/withdraw", {
      method: "POST",
      body: JSON.stringify({
        bankItemId: nft.id,
      }),
    });
  };

  if (!session?.user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please sign in to view your wallet
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-medievalsharp mb-4">
          Game Wallet (Custodial)
        </h2>
        <code className="block bg-gray-100 p-2 rounded">
          {session.user.custodialWalletAddress}
        </code>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <NFTGrid
            nfts={custodialNFTs}
            onAction={handleWithdraw}
            actionLabel="Withdraw"
          />
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-medievalsharp mb-4">External Wallet</h2>
        <code className="block bg-gray-100 p-2 rounded">
          {session.user.walletAddress}
        </code>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <NFTGrid
            nfts={externalNFTs}
            onAction={handleDeposit}
            actionLabel="Deposit"
          />
        )}
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        nft={selectedNFT}
      />
    </div>
  );
}
