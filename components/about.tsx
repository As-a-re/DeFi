"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Rocket, Users } from "lucide-react"

export default function About() {
  const features = [
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "AI-Powered Development",
      description: "Leverage AI tools to accelerate your dApp creation and deployment process.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "Bitcoin Sidechain",
      description: "Build on Rootstock, the first and longest-running Bitcoin sidechain.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community & Support",
      description: "Connect with experts and like-minded developers in the Web3 ecosystem.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About the Hackathon</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            A groundbreaking hackathon designed to empower developers to accelerate their dApp creation and deployment
            using AI-driven workflows.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full border-none bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-card rounded-lg p-6 md:p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-4">Who Should Participate?</h3>
          <p className="text-lg mb-4">
            Whether you're a seasoned Web3 developer or new to the ecosystem, this is your chance to push the boundaries
            of decentralized applications while using AI to enhance your development process.
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80">
            <li>Blockchain developers interested in Bitcoin-based solutions</li>
            <li>AI enthusiasts looking to apply their skills to Web3</li>
            <li>DeFi builders and financial technology innovators</li>
            <li>Web3 designers and UX specialists</li>
            <li>Entrepreneurs with ideas for real-world blockchain applications</li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

