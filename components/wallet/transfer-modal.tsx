import { useState } from "react";
import Modal from "../modal";

interface NFT {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: NFT | null;
}

export default function TransferModal({
  isOpen,
  onClose,
  nft,
}: TransferModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async () => {
    if (!nft || !recipientAddress) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/nft/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nftId: nft.id,
          recipientAddress,
        }),
      });

      if (!response.ok) throw new Error("Transfer failed");

      onClose();
    } catch (error) {
      console.error("Transfer error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-medievalsharp mb-4">Transfer NFT</h2>
        {nft && (
          <div className="mb-4">
            <h3 className="font-medium">{nft.name}</h3>
            <p className="text-sm text-gray-600">Token ID: {nft.tokenId}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={isLoading || !recipientAddress}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
          >
            {isLoading ? "Transferring..." : "Transfer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
