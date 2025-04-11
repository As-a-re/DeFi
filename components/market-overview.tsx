"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { fetchMarketData } from "@/lib/blockchain"
import Chart from "chart.js/auto"

interface MarketAsset {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  supplyApy: number
  borrowApy: number
  totalSupply: number
  totalBorrow: number
}

export default function MarketOverview() {
  const [assets, setAssets] = useState<MarketAsset[]>([])
  const [loading, setLoading] = useState(true)
  const supplyChartRef = useRef<HTMLCanvasElement>(null)
  const borrowChartRef = useRef<HTMLCanvasElement>(null)
  const supplyChartInstance = useRef<Chart | null>(null)
  const borrowChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const marketData = await fetchMarketData()
        setAssets(marketData)
      } catch (error) {
        console.error("Failed to load market data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Refresh data every minute
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (loading || !assets.length) return

    // Create supply chart
    if (supplyChartRef.current) {
      // Destroy previous chart if it exists
      if (supplyChartInstance.current) {
        supplyChartInstance.current.destroy()
      }

      const ctx = supplyChartRef.current.getContext("2d")
      if (ctx) {
        supplyChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: assets.map((asset) => asset.symbol),
            datasets: [
              {
                data: assets.map((asset) => asset.totalSupply),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
              },
              title: {
                display: true,
                text: "Total Supply Distribution",
              },
            },
          },
        })
      }
    }

    // Create borrow chart
    if (borrowChartRef.current) {
      // Destroy previous chart if it exists
      if (borrowChartInstance.current) {
        borrowChartInstance.current.destroy()
      }

      const ctx = borrowChartRef.current.getContext("2d")
      if (ctx) {
        borrowChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: assets.map((asset) => asset.symbol),
            datasets: [
              {
                data: assets.map((asset) => asset.totalBorrow),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
              },
              title: {
                display: true,
                text: "Total Borrow Distribution",
              },
            },
          },
        })
      }
    }

    return () => {
      // Clean up charts on unmount
      if (supplyChartInstance.current) {
        supplyChartInstance.current.destroy()
      }
      if (borrowChartInstance.current) {
        borrowChartInstance.current.destroy()
      }
    }
  }, [assets, loading])

  return (
    <section id="markets" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Overview</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Real-time data from the Rootstock DeFi ecosystem
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
              <CardDescription>Current rates and statistics for assets on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="assets">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>

                <TabsContent value="assets">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-4 px-2">Asset</th>
                          <th className="text-right py-4 px-2">Price</th>
                          <th className="text-right py-4 px-2">24h Change</th>
                          <th className="text-right py-4 px-2">Supply APY</th>
                          <th className="text-right py-4 px-2">Borrow APY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8">
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          assets.map((asset, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-4 px-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                    {asset.symbol.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium">{asset.symbol}</div>
                                    <div className="text-sm text-foreground/70">{asset.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-2">${asset.price.toLocaleString()}</td>
                              <td className="text-right py-4 px-2">
                                <div
                                  className={`flex items-center justify-end ${
                                    asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                                  }`}
                                >
                                  {asset.change24h >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                  )}
                                  {Math.abs(asset.change24h).toFixed(2)}%
                                </div>
                              </td>
                              <td className="text-right py-4 px-2 text-green-500">{asset.supplyApy.toFixed(2)}%</td>
                              <td className="text-right py-4 px-2 text-foreground/90">{asset.borrowApy.toFixed(2)}%</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="charts">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Supply Distribution</h3>
                      <div className="chart-container">
                        <canvas ref={supplyChartRef}></canvas>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Borrow Distribution</h3>
                      <div className="chart-container">
                        <canvas ref={borrowChartRef}></canvas>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

