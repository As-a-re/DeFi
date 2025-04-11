"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Bitcoin, Cpu, Database } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"

export default function Hero() {
  const { connectWallet, address } = useWeb3()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-1/3 left-1/5 text-primary/30"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Bitcoin size={80} />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/4 text-primary/30"
        animate={{
          y: [0, -30, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 1,
        }}
      >
        <Cpu size={60} />
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/3 text-primary/30"
        animate={{
          y: [0, 25, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      >
        <Database size={70} />
      </motion.div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">DeFi Genius</span> on Rootstock
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-8">
            AI-powered lending platform for smarter decentralized finance
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {address ? (
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="#dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button onClick={connectWallet} size="lg" className="text-lg px-8">
                Connect Wallet <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="#ai-advisor">Try AI Advisor</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-foreground/60">
            <div className="flex items-center">
              <span className="font-semibold">Powered by:</span>
              <span className="ml-2 font-bold">Rootstock</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">Built with:</span>
              <span className="ml-2">thirdweb</span>
              <span className="mx-2">•</span>
              <span>Alchemy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

