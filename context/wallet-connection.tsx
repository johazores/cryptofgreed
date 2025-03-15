"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { BrowserProvider, JsonRpcSigner, formatEther } from "ethers";

interface WalletContextType {
  walletAddress: string | undefined;
  provider: BrowserProvider | undefined;
  signer: JsonRpcSigner | undefined;
  isConnecting: boolean;
  error: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");

  const fetchBalance = async (address: string, provider: BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0");
    }
  };

  const initializeProvider = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    return new BrowserProvider(window.ethereum);
  }, []);

  const checkExistingConnection = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        const newProvider = await initializeProvider();
        if (!newProvider) return;

        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();

        setProvider(newProvider);
        setSigner(signer);
        setWalletAddress(address);
        await fetchBalance(address, newProvider);
      }
    } catch (error) {
      console.error("Error checking existing connection:", error);
    }
  }, [initializeProvider]);

  useEffect(() => {
    checkExistingConnection();
  }, [checkExistingConnection]);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const newProvider = await initializeProvider();
        if (!newProvider) throw new Error("Failed to initialize provider");

        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();

        // Save wallet address to database
        const response = await fetch("/api/user/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save wallet address");
        }

        setProvider(newProvider);
        setSigner(signer);
        setWalletAddress(address);
        await fetchBalance(address, newProvider);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = useCallback(async () => {
    try {
      // Clear wallet address from database
      await fetch("/api/user/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: null }),
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }

    setWalletAddress(undefined);
    setProvider(undefined);
    setSigner(undefined);
    setError(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletAddress) {
        checkExistingConnection();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [disconnectWallet, checkExistingConnection, walletAddress]);

  useEffect(() => {
    if (!provider || !walletAddress) return;

    const interval = setInterval(() => {
      fetchBalance(walletAddress, provider);
    }, 10000); // Update balance every 10 seconds

    return () => clearInterval(interval);
  }, [provider, walletAddress]);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        provider,
        signer,
        isConnecting,
        error,
        balance,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
