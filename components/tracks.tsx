"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, ShoppingCart, UserCircle } from "lucide-react"

export default function Tracks() {
  const tracks = [
    {
      icon: <Coins className="h-12 w-12 text-primary" />,
      title: "DeFi and Payments",
      description:
        "Build innovative decentralized finance (DeFi) solutions using AI for faster contract creation, payment systems, and automated protocols.",
      examples: [
        "AI-powered lending protocols",
        "Automated market makers with predictive analytics",
        "Cross-chain payment solutions",
        "Smart contract auditing tools",
      ],
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-primary" />,
      title: "Commerce and Gig Economy",
      description:
        "Explore how AI can streamline eCommerce, digital marketplaces, and gig economy applications, driving automation and improving user experience.",
      examples: [
        "Decentralized marketplaces with AI matching",
        "Supply chain verification systems",
        "Tokenized loyalty programs",
        "Freelance platforms with smart contracts",
      ],
    },
    {
      icon: <UserCircle className="h-12 w-12 text-primary" />,
      title: "Identity and Reputation in Web3",
      description:
        "Develop AI-driven systems to enhance identity management, reputation systems, and privacy solutions in the decentralized Web3 ecosystem.",
      examples: [
        "Self-sovereign identity solutions",
        "Reputation scoring mechanisms",
        "Privacy-preserving verification",
        "Decentralized social graphs",
      ],
    },
  ]

  return (
    <section id="tracks" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hackathon Tracks</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Choose from three innovative tracks to showcase your skills and creativity in building AI-powered Web3
            applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full border border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="mb-4">{track.icon}</div>
                  <CardTitle className="text-2xl">{track.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">{track.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Example Projects:</h4>
                    <ul className="list-disc list-inside space-y-1 text-foreground/70">
                      {track.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

