import { ethers } from "ethers";
import { encrypt } from "@/lib/encryption";

export class WalletService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  }

  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }

  async generateCustodialWallet(): Promise<{
    address: string;
    encryptedPrivateKey: string;
  }> {
    const wallet = ethers.Wallet.createRandom();
    const encryptedPrivateKey = await encrypt(wallet.privateKey);

    return {
      address: wallet.address,
      encryptedPrivateKey,
    };
  }

  async transferNFT(
    contractAddress: string,
    tokenId: string,
    from: string,
    to: string,
    privateKey: string
  ) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(
      contractAddress,
      ["function transferFrom(address from, address to, uint256 tokenId)"],
      wallet
    );

    return await contract.transferFrom(from, to, tokenId);
  }
}
