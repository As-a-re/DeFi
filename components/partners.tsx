"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Partners() {
  const partners = [
    {
      name: "Rootstock Labs",
      logo: "/placeholder.svg?height=80&width=200",
      description: "The first smart contract platform secured by Bitcoin",
    },
    {
      name: "thirdweb",
      logo: "/placeholder.svg?height=80&width=200",
      description: "Web3 development framework",
    },
    {
      name: "Alchemy",
      logo: "/placeholder.svg?height=80&width=200",
      description: "Blockchain development platform",
    },
  ]

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            The AI BUIDL Lab is made possible by these amazing organizations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className="h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
              <p className="text-foreground/70">{partner.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

