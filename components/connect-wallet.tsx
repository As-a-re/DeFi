"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, ExternalLink } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ACTIVE_NETWORK } from "@/lib/web3"
import Link from "next/link"

export default function ConnectWallet() {
  const { address, connectWallet, isConnecting, error, isCorrectNetwork, chainId } = useWeb3()
  const [showSection, setShowSection] = useState(true)

  // If wallet is connected and on correct network, hide this section after a delay
  useEffect(() => {
    if (address && isCorrectNetwork && showSection) {
      const timer = setTimeout(() => setShowSection(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [address, isCorrectNetwork, showSection])

  if (address && isCorrectNetwork && !showSection) {
    return null
  }

  return (
    <section id="connect" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {address ? (isCorrectNetwork ? "Wallet Connected!" : "Wrong Network") : "Connect Your Wallet"}
              </CardTitle>
              <CardDescription>
                {address
                  ? isCorrectNetwork
                    ? "You can now access all DeFi Genius features"
                    : `Please switch to ${ACTIVE_NETWORK.name} to use this application`
                  : "Connect your wallet to access the DeFi Genius platform"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {address ? (
                isCorrectNetwork ? (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                      <Wallet className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mb-4">Connected Address:</p>
                    <code className="bg-secondary p-2 rounded text-sm block mb-4 overflow-hidden text-ellipsis">
                      {address}
                    </code>
                    <p className="text-foreground/70 text-sm">Redirecting to dashboard...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full mb-4">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <p className="mb-4">Connected to wrong network:</p>
                    <code className="bg-secondary p-2 rounded text-sm block mb-4">Chain ID: {chainId}</code>
                    <p className="text-foreground/70 text-sm mb-6">
                      Please switch to {ACTIVE_NETWORK.name} (Chain ID: {ACTIVE_NETWORK.id}) in your wallet.
                    </p>
                    <Button
                      onClick={async () => {
                        if (typeof window !== "undefined" && window.ethereum) {
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
                                console.error("Failed to add network:", addError)
                              }
                            }
                          }
                        }
                      }}
                    >
                      Switch to {ACTIVE_NETWORK.name}
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mb-6 text-center text-foreground/70">
                    Connect your wallet to deposit assets, take out loans, and earn interest on Rootstock.
                  </p>
                  <Button onClick={connectWallet} disabled={isConnecting} className="w-full mb-4" size="lg">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                  <div className="text-center text-sm text-foreground/70 mt-4">
                    <p className="mb-2">Don't have a wallet?</p>
                    <Link
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      Install MetaMask <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

