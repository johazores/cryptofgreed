interface NFT {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
}

interface NFTGridProps {
  nfts: NFT[];
  onAction: (nft: NFT) => void;
  actionLabel: string;
}

export default function NFTGrid({ nfts, onAction, actionLabel }: NFTGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-600">
        No NFTs found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts.map((nft) => (
        <div key={nft.id} className="border rounded-lg p-4 bg-white shadow">
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
            onClick={() => onAction(nft)}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
          >
            {actionLabel}
          </button>
        </div>
      ))}
    </div>
  );
}