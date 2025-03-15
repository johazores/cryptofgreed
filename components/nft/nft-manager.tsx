import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface NFT {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
}

export default function NFTManager() {
  const { data: session } = useSession();
  const [bankItems, setBankItems] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(session);

  useEffect(() => {
    fetchBankItems();
  }, []);

  const fetchBankItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/nft/bank");
      if (!response.ok) throw new Error("Failed to fetch bank items");
      const data = await response.json();
      setBankItems(data);
    } catch (error) {
      toast.error("Failed to load NFT items");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (nftId: string) => {
    try {
      const response = await fetch("/api/nft/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankItemId: nftId }),
      });

      if (!response.ok) throw new Error("Failed to withdraw NFT");

      toast.success("NFT withdrawn successfully");
      fetchBankItems(); // Refresh the list
    } catch (error) {
      toast.error("Failed to withdraw NFT");
      console.error(error);
    }
  };

  if (!session?.user?.walletAddress) {
    return (
      <div className="p-4 text-center text-gray-600">
        Please connect your external wallet to manage NFTs
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-medievalsharp mb-4">NFT Management</h2>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : bankItems.length === 0 ? (
        <div className="text-center py-4 text-gray-600">
          No NFTs in your game wallet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankItems.map((nft) => (
            <div key={nft.id} className="border rounded-lg p-4">
              {nft.imageUrl && (
                <img
                  src={nft.imageUrl}
                  alt={nft.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-medium">{nft.name}</h3>
              <p className="text-xs text-gray-600 mb-2">
                Token ID: {nft.tokenId}
              </p>
              <button
                onClick={() => handleWithdraw(nft.id)}
                className="w-full px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark text-sm"
              >
                Withdraw to External Wallet
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
