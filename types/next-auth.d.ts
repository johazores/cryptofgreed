import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      walletAddress?: string | null;
      custodialWalletAddress?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    walletAddress?: string | null;
    custodialWalletAddress?: string | null;
  }
}
