import { ethers } from "ethers"
import { toast } from "@/hooks/use-toast"

// Rootstock network configuration
export const ROOTSTOCK_TESTNET = {
  id: 31,
  name: "Rootstock Testnet",
  network: "rsk-testnet",
  rpcUrls: {
    default: "https://public-node.testnet.rsk.co",
    public: "https://public-node.testnet.rsk.co",
  },
  blockExplorers: {
    default: { name: "RSK Explorer", url: "https://explorer.testnet.rsk.co" },
  },
  nativeCurrency: {
    name: "Test RSK Bitcoin",
    symbol: "tRBTC",
    decimals: 18,
  },
}

export const ROOTSTOCK_MAINNET = {
  id: 30,
  name: "Rootstock Mainnet",
  network: "rsk-mainnet",
  rpcUrls: {
    default: "https://public-node.rsk.co",
    public: "https://public-node.rsk.co",
  },
  blockExplorers: {
    default: { name: "RSK Explorer", url: "https://explorer.rsk.co" },
  },
  nativeCurrency: {
    name: "RSK Bitcoin",
    symbol: "RBTC",
    decimals: 18,
  },
}

// Use testnet for development, switch to mainnet for production
export const ACTIVE_NETWORK = ROOTSTOCK_TESTNET

// Initialize ethers provider
export function getProvider() {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }

  // Fallback to RPC provider if no wallet is available
  return new ethers.JsonRpcProvider(ACTIVE_NETWORK.rpcUrls.default)
}

// Get signer for transactions
export async function getSigner() {
  const provider = getProvider()
  if (provider instanceof ethers.BrowserProvider) {
    return provider.getSigner()
  }
  throw new Error("No wallet connected")
}

// Connect wallet and return address
export async function connectWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No Web3 wallet detected. Please install MetaMask or another Web3 wallet.")
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)

    // Request account access
    const accounts = await provider.send("eth_requestAccounts", [])

    // Check if we're on the correct network
    const network = await provider.getNetwork()
    if (network.chainId !== BigInt(ACTIVE_NETWORK.id)) {
      // Prompt user to switch networks
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${ACTIVE_NETWORK.id.toString(16)}` }],
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${ACTIVE_NETWORK.id.toString(16)}`,
                  chainName: ACTIVE_NETWORK.name,
                  nativeCurrency: ACTIVE_NETWORK.nativeCurrency,
                  rpcUrls: [ACTIVE_NETWORK.rpcUrls.default],
                  blockExplorerUrls: [ACTIVE_NETWORK.blockExplorers.default.url],
                },
              ],
            })
          } catch (addError) {
            throw new Error("Failed to add Rootstock network to your wallet.")
          }
        } else {
          throw new Error("Failed to switch to Rootstock network.")
        }
      }
    }

    return accounts[0]
  } catch (error) {
    console.error("Error connecting wallet:", error)
    throw error
  }
}

// Listen for account changes
export function listenForAccountChanges(callback: (accounts: string[]) => void) {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on("accountsChanged", callback)
    return () => window.ethereum.removeListener("accountsChanged", callback)
  }
  return () => {}
}

// Listen for network changes
export function listenForNetworkChanges(callback: (chainId: string) => void) {
  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on("chainChanged", callback)
    return () => window.ethereum.removeListener("chainChanged", callback)
  }
  return () => {}
}

// Format address for display
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Send transaction helper
export async function sendTransaction(transaction: ethers.TransactionRequest) {
  try {
    const signer = await getSigner()
    const tx = await signer.sendTransaction(transaction)

    toast({
      title: "Transaction Sent",
      description: `Transaction hash: ${tx.hash}`,
    })

    // Wait for transaction to be mined
    const receipt = await tx.wait()

    toast({
      title: "Transaction Confirmed",
      description: `Block number: ${receipt?.blockNumber}`,
    })

    return receipt
  } catch (error) {
    console.error("Transaction error:", error)

    // Handle user rejection
    if (error.code === 4001) {
      toast({
        title: "Transaction Cancelled",
        description: "You rejected the transaction.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Transaction Failed",
        description: error.message || "Something went wrong with your transaction.",
        variant: "destructive",
      })
    }

    throw error
  }
}

