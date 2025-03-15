"use client";

import { useWallet } from "@/context/wallet-connection";
import Button from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export default function WalletButton() {
  const {
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnectClick = async () => {
    await connectWallet();
  };

  const handleSwitchWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (error) {
      console.error("Failed to switch wallet:", error);
    }
    setShowDropdown(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
        <Button
          onClick={() => window.open("https://metamask.io", "_blank")}
          variant="ghost"
          size="sm"
        >
          Install MetaMask
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={
          walletAddress
            ? () => setShowDropdown(!showDropdown)
            : handleConnectClick
        }
        disabled={isConnecting}
        variant="outline"
        size="sm"
        className={twMerge(
          "flex items-center gap-2",
          walletAddress && "bg-primary/10"
        )}
      >
        {isConnecting
          ? "Connecting..."
          : walletAddress
          ? formatAddress(walletAddress)
          : "Connect Wallet"}
      </Button>

      {showDropdown && walletAddress && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={handleSwitchWallet}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              Switch Wallet
            </button>
            <button
              onClick={() => {
                disconnectWallet();
                setShowDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
