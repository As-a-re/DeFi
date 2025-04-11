"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Send, Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { getAiRecommendation } from "@/lib/ai"

interface Recommendation {
  type: "borrow" | "lend" | "swap" | "alert"
  title: string
  description: string
  action?: string
  apy?: number
  risk?: "low" | "medium" | "high"
}

export default function AiAdvisor() {
  const { address } = useWeb3()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      type: "lend",
      title: "Lend RBTC for high returns",
      description: "Current market conditions favor lending RBTC with a competitive APY of 5.2%",
      action: "Deposit RBTC",
      apy: 5.2,
      risk: "low",
    },
    {
      type: "borrow",
      title: "Borrow DOC stablecoin",
      description: "Borrow DOC against your RBTC at a favorable interest rate of 3.8%",
      action: "Borrow DOC",
      apy: 3.8,
      risk: "medium",
    },
    {
      type: "alert",
      title: "Market Volatility Alert",
      description: "Bitcoin price volatility has increased. Consider adjusting your collateral ratio.",
      risk: "high",
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResponse("")

    try {
      const result = await getAiRecommendation(query, address)
      setResponse(result.response)

      // If there are new recommendations, add them
      if (result.recommendations && result.recommendations.length > 0) {
        setRecommendations((prev) => [...result.recommendations, ...prev])
      }
    } catch (error) {
      console.error("AI recommendation error:", error)
      setResponse("Sorry, I couldn't process your request. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (risk?: "low" | "medium" | "high") => {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "borrow":
        return <TrendingUp className="h-5 w-5" />
      case "lend":
        return <Sparkles className="h-5 w-5" />
      case "alert":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Sparkles className="h-5 w-5" />
    }
  }

  return (
    <section id="ai-advisor" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Financial Advisor</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Get personalized DeFi recommendations and answers to your financial questions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-6 w-6 mr-2 text-primary" />
                  Ask the AI Advisor
                </CardTitle>
                <CardDescription>
                  Ask questions about DeFi strategies, market conditions, or get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 min-h-[200px] max-h-[400px] overflow-y-auto bg-secondary/50 rounded-lg p-4">
                  {response ? (
                    <div className="prose dark:prose-invert">
                      {response.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-foreground/70 h-full flex flex-col justify-center">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                      <p>
                        Ask me anything about DeFi strategies, market analysis, or get personalized recommendations.
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                  <Textarea
                    placeholder="E.g., What's the best strategy for my RBTC holdings? Should I lend or borrow?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading || !query.trim()}>
                      {isLoading ? "Processing..." : "Ask AI Advisor"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Smart Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions based on market conditions and your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full bg-primary/10 mr-2 ${getRiskColor(rec.risk)}`}>
                              {getTypeIcon(rec.type)}
                            </div>
                            <h3 className="font-medium">{rec.title}</h3>
                          </div>
                          {rec.risk && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                rec.risk === "low"
                                  ? "bg-green-100 text-green-800"
                                  : rec.risk === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rec.risk.toUpperCase()} RISK
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/70 mb-3">{rec.description}</p>
                        {rec.apy && (
                          <div className="flex items-center text-sm mb-3">
                            <span className="text-foreground/70 mr-2">APY:</span>
                            <span className="font-medium text-green-500">{rec.apy}%</span>
                          </div>
                        )}
                        {rec.action && (
                          <Button size="sm" variant="outline" className="w-full">
                            {rec.action}
                          </Button>
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="opportunities" className="space-y-4">
                    {recommendations
                      .filter((rec) => rec.type === "borrow" || rec.type === "lend")
                      .map((rec, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full bg-primary/10 mr-2 ${getRiskColor(rec.risk)}`}>
                                {getTypeIcon(rec.type)}
                              </div>
                              <h3 className="font-medium">{rec.title}</h3>
                            </div>
                            {rec.risk && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  rec.risk === "low"
                                    ? "bg-green-100 text-green-800"
                                    : rec.risk === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {rec.risk.toUpperCase()} RISK
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/70 mb-3">{rec.description}</p>
                          {rec.apy && (
                            <div className="flex items-center text-sm mb-3">
                              <span className="text-foreground/70 mr-2">APY:</span>
                              <span className="font-medium text-green-500">{rec.apy}%</span>
                            </div>
                          )}
                          {rec.action && (
                            <Button size="sm" variant="outline" className="w-full">
                              {rec.action}
                            </Button>
                          )}
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="alerts" className="space-y-4">
                    {recommendations
                      .filter((rec) => rec.type === "alert")
                      .map((rec, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full bg-primary/10 mr-2 ${getRiskColor(rec.risk)}`}>
                                {getTypeIcon(rec.type)}
                              </div>
                              <h3 className="font-medium">{rec.title}</h3>
                            </div>
                            {rec.risk && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  rec.risk === "low"
                                    ? "bg-green-100 text-green-800"
                                    : rec.risk === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {rec.risk.toUpperCase()} RISK
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/70 mb-3">{rec.description}</p>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

