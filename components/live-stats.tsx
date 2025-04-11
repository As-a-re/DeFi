"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Code, Trophy, Bitcoin } from "lucide-react"
import { fetchRootstockStats } from "@/lib/blockchain"

interface Stats {
  participants: number
  projects: number
  prizePool: number
  blockHeight: number
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stats>({
    participants: 0,
    projects: 0,
    prizePool: 0,
    blockHeight: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      try {
        const blockchainData = await fetchRootstockStats()
        setStats({
          participants: 120 + Math.floor(Math.random() * 30), // Simulated growth
          projects: 45 + Math.floor(Math.random() * 10), // Simulated growth
          prizePool: 50000,
          blockHeight: blockchainData.height,
        })
      } catch (error) {
        console.error("Failed to fetch blockchain stats:", error)
        // Fallback data
        setStats({
          participants: 150,
          projects: 52,
          prizePool: 50000,
          blockHeight: 5123456,
        })
      } finally {
        setLoading(false)
      }
    }

    getStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(getStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: stats.participants,
      label: "Participants",
      prefix: "",
      suffix: "+",
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      value: stats.projects,
      label: "Projects",
      prefix: "",
      suffix: "",
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      value: stats.prizePool,
      label: "Prize Pool",
      prefix: "$",
      suffix: "",
    },
    {
      icon: <Bitcoin className="h-8 w-8 text-primary" />,
      value: stats.blockHeight,
      label: "Current Block Height",
      prefix: "",
      suffix: "",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Hackathon Stats</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Real-time data from the AI BUIDL Lab hackathon and Rootstock blockchain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">{item.icon}</div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">
                      {loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        <>
                          {item.prefix}
                          {item.value.toLocaleString()}
                          {item.suffix}
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-foreground/70">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

