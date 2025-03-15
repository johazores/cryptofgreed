"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

interface WalletContextType {
  walletAddress: string | undefined;
  provider: BrowserProvider | undefined;
  signer: JsonRpcSigner | undefined;
  isConnecting: boolean;
  error: string | null;
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

        setProvider(newProvider);
        setSigner(signer);
        setWalletAddress(address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = useCallback(() => {
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

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        provider,
        signer,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
