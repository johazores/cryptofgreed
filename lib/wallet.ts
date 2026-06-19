import { ethers } from "ethers";
import { encrypt } from "@/lib/encryption";
import CryptOfGreedNFT from "@/abis/CryptOfGreedNFT.json";
export class WalletService {
  private provider: ethers.JsonRpcProvider;
  private contractAddress: string;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
  }

  async generateCustodialWallet() {
    const wallet = ethers.Wallet.createRandom();
    const encryptedPrivateKey = await encrypt(wallet.privateKey);
    return { address: wallet.address, encryptedPrivateKey };
  }

  async transferNFT(
    tokenId: string,
    from: string,
    to: string,
    privateKey: string
  ) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(
      this.contractAddress,
      CryptOfGreedNFT.abi,
      wallet
    );
    return await contract.transferFrom(from, to, tokenId);
  }

  async burnNFT(tokenId: string, privateKey: string) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(
      this.contractAddress,
      CryptOfGreedNFT.abi,
      wallet
    );
    return await contract.burnToken(tokenId);
  }

  async getNFTs(walletAddress: string) {
    if (!walletAddress) return [];

    // You'll need to implement the NFT fetching logic here
    // This is a basic example using ERC721 interface
    const erc721Interface = new ethers.Interface([
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
    ]);

    // You would need to maintain a list of NFT contract addresses
    // This is just an example - you should replace with your actual NFT contract addresses
    const nftContracts: string[] = [
      // Add your NFT contract addresses here
      // "0x..."
    ];

    const nfts = [];

    for (const contractAddress of nftContracts) {
      const contract = new ethers.Contract(
        contractAddress,
        erc721Interface,
        this.provider
      );

      try {
        const balance = await contract.balanceOf(walletAddress);

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
          const tokenURI = await contract.tokenURI(tokenId);

          nfts.push({
            id: `${contractAddress}-${tokenId}`,
            contractAddress,
            tokenId: tokenId.toString(),
            name: `NFT #${tokenId}`, // You might want to fetch this from tokenURI
            imageUrl: null, // You might want to fetch this from tokenURI
          });
        }
      } catch (error) {
        console.error(
          `Error fetching NFTs from contract ${contractAddress}:`,
          error
        );
      }
    }

    return nfts;
  }
}
