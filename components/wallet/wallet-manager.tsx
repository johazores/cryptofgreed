import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function WalletManager() {
  const { data: session } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectExternalWallet = async () => {
    try {
      setIsConnecting(true);
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error('Please install MetaMask to connect your wallet');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const address = accounts[0];

      // Update the user's external wallet address
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to update wallet address');
      }

      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: null }),
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect wallet');
      }

      toast.success('Wallet disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect wallet');
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-medievalsharp mb-4">Wallet Management</h2>
      
      {/* Custodial Wallet Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h3 className="text-sm font-semibold">Game Wallet (Custodial)</h3>
        <p className="text-xs text-gray-600 mb-2">This wallet holds your in-game NFTs</p>
        <code className="text-xs bg-gray-100 p-1 rounded">
          {session?.user?.custodialWalletAddress || 'Not available'}
        </code>
      </div>

      {/* External Wallet Connection */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold">External Wallet</h3>
        {session?.user?.walletAddress ? (
          <>
            <p className="text-xs text-gray-600 mb-2">Connected wallet:</p>
            <code className="text-xs bg-gray-100 p-1 rounded block mb-2">
              {session.user.walletAddress}
            </code>
            <button
              onClick={disconnectWallet}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button
            onClick={connectExternalWallet}
            disabled={isConnecting}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        )}
      </div>
    </div>
  );
}