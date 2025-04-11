"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { connectWallet, listenForAccountChanges, listenForNetworkChanges, ACTIVE_NETWORK } from "@/lib/web3"
import { toast } from "@/hooks/use-toast"

interface Web3ContextType {
  address: string | null
  connectWallet: () => Promise<void>
  isConnecting: boolean
  error: string | null
  chainId: number | null
  isCorrectNetwork: boolean
}

export const Web3Context = createContext<Web3ContextType>({
  address: null,
  connectWallet: async () => {},
  isConnecting: false,
  error: null,
  chainId: null,
  isCorrectNetwork: false,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  // Check if wallet was previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Check if accounts are already connected
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
          }

          // Check current network
          const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
          const currentChainId = Number.parseInt(chainIdHex, 16)
          setChainId(currentChainId)
          setIsCorrectNetwork(currentChainId === ACTIVE_NETWORK.id)
        } catch (err) {
          console.error("Failed to check wallet connection:", err)
        }
      }
    }

    checkConnection()
  }, [])

  // Set up event listeners for wallet changes
  useEffect(() => {
    const accountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        setAddress(null)
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        })
      } else {
        // User switched account
        setAddress(accounts[0])
        toast({
          title: "Account Changed",
          description: `Connected to account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    }

    const chainChanged = (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16)
      setChainId(newChainId)
      setIsCorrectNetwork(newChainId === ACTIVE_NETWORK.id)

      if (newChainId !== ACTIVE_NETWORK.id) {
        toast({
          title: "Wrong Network",
          description: `Please switch to ${ACTIVE_NETWORK.name} to use this application.`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Network Changed",
          description: `Connected to ${ACTIVE_NETWORK.name}.`,
        })
      }

      // Reload the page to refresh all data
      window.location.reload()
    }

    const unsubscribeAccounts = listenForAccountChanges(accountsChanged)
    const unsubscribeNetwork = listenForNetworkChanges(chainChanged)

    return () => {
      unsubscribeAccounts()
      unsubscribeNetwork()
    }
  }, [])

  // Connect wallet function
  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const userAddress = await connectWallet()
      setAddress(userAddress)

      // Check if on correct network
      if (typeof window !== "undefined" && window.ethereum) {
        const chainIdHex = await window.ethereum.request({ method: "eth_chainId" })
        const currentChainId = Number.parseInt(chainIdHex, 16)
        setChainId(currentChainId)
        setIsCorrectNetwork(currentChainId === ACTIVE_NETWORK.id)

        if (currentChainId !== ACTIVE_NETWORK.id) {
          toast({
            title: "Wrong Network",
            description: `Please switch to ${ACTIVE_NETWORK.name} to use this application.`,
            variant: "destructive",
          })
        }
      }
    } catch (err) {
      console.error("Connection error:", err)
      setError(err.message || "Failed to connect wallet. Please make sure you have a Web3 wallet installed.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Web3Context.Provider
      value={{
        address,
        connectWallet: handleConnectWallet,
        isConnecting,
        error,
        chainId,
        isCorrectNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

