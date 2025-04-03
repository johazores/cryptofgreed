"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, HelpCircle, Moon, LogOut, MessageSquare } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export default function UserAvatar() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    walletAddress: ""
  })

  // Update userData when session changes or when localStorage changes
  useEffect(() => {
    const updateUserDataFromStorage = () => {
      const storedEmail = localStorage.getItem('userEmail')
      if (session?.user) {
        setUserData({
          name: session.user.name || "",
          email: storedEmail || session.user.email || "",
          image: session.user.image || "",
          walletAddress: session.user.walletAddress || ""
        })
      }
    }

    // Initial update
    updateUserDataFromStorage()

    // Listen for storage changes
    const handleStorageChange = () => {
      updateUserDataFromStorage()
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for our custom event
    window.addEventListener('storage-update', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('storage-update', handleStorageChange)
    }
  }, [session?.user])

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session?.user) return null

  const handleSettingsClick = () => {
    setIsOpen(false)
    router.push("/settings")
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      if (!window.ethereum) {
        toast.error('Please install MetaMask to connect your wallet')
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      const address = accounts[0]

      // Update the user's external wallet address
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })

      if (!response.ok) {
        throw new Error('Failed to update wallet address')
      }

      // Update the session to reflect the new wallet address
      await update()
      setUserData(prev => ({ ...prev, walletAddress: address }))
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }


  const updateEmail = async (newEmail: string) => {
    try {
      setIsUpdating(true)
      const response = await fetch('/api/user/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update email')
      }

      // Update the session to reflect the new email
      await update()
      
      // Store the updated email in localStorage
      localStorage.setItem('userEmail', newEmail)
      
      // Update local state immediately
      setUserData(prev => ({ ...prev, email: newEmail }))
      
      // Dispatch custom event for other components
      window.dispatchEvent(new Event('storage-update'))
      
      // Close the modal after successful update
      setIsOpen(false)
      
      toast.success('Email updated successfully')
    } catch (error) {
      console.error('Error updating email:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update email')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-full bg-gray-100 overflow-hidden hover:ring-2 hover:ring-gray-300 transition-all flex items-center justify-center"
      >
        {userData.image ? (
          <img
            src={userData.image}
            alt={userData.name || "User"}
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <User className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#242526] shadow-lg ring-1 ring-gray-700 z-50 animate-modal-enter">
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name || "User"}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{userData.email || "User"}</h3>
                {userData.walletAddress && (
                  <p className="text-sm text-gray-400">
                    {`${userData.walletAddress.slice(0, 6)}...${userData.walletAddress.slice(-4)}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden md:inline">Settings & privacy</span>
            </button>

            {/* <Link
              href="/help"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <HelpCircle className="h-5 w-5" />
              <span className="hidden md:inline">Help & support</span>
            </Link> */}

            <button
              onClick={async () => {
                setIsOpen(false)
                await signOut({ 
                  callbackUrl: '/',
                  redirect: true 
                })
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-200 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

