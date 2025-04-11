"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { fetchMarketData } from "@/lib/blockchain"
import { useWeb3 } from "@/hooks/use-web3"
import { getAiLoanRecommendation } from "@/lib/ai"
import { createLoan } from "@/lib/blockchain"
import { toast } from "@/hooks/use-toast"
import { TOKEN_ADDRESSES } from "@/lib/contracts"

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

export default function LoanCalculator() {
  const { address, isCorrectNetwork } = useWeb3()
  const [assets, setAssets] = useState<MarketAsset[]>([])
  const [loading, setLoading] = useState(true)

  const [collateralAsset, setCollateralAsset] = useState("")
  const [borrowAsset, setBorrowAsset] = useState("")
  const [collateralAmount, setCollateralAmount] = useState("1")
  const [ltv, setLtv] = useState(50)
  const [term, setTerm] = useState(30)

  const [collateralValue, setCollateralValue] = useState(0)
  const [maxBorrowAmount, setMaxBorrowAmount] = useState(0)
  const [borrowAmount, setBorrowAmount] = useState(0)
  const [interestRate, setInterestRate] = useState(0)
  const [totalRepayment, setTotalRepayment] = useState(0)

  const [aiRecommendation, setAiRecommendation] = useState("")
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isCreatingLoan, setIsCreatingLoan] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const marketData = await fetchMarketData()
        setAssets(marketData)

        if (marketData.length > 0) {
          setCollateralAsset(marketData[0].symbol)
          setBorrowAsset(marketData[1]?.symbol || marketData[0].symbol)
        }
      } catch (error) {
        console.error("Failed to load market data:", error)
        toast({
          title: "Error Loading Data",
          description: "Failed to load market data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate loan details when inputs change
  useEffect(() => {
    if (!collateralAsset || !borrowAsset || !assets.length) return

    const collateralAssetData = assets.find((a) => a.symbol === collateralAsset)
    const borrowAssetData = assets.find((a) => a.symbol === borrowAsset)

    if (!collateralAssetData || !borrowAssetData) return

    const collateralAmountNum = Number.parseFloat(collateralAmount) || 0
    const collateralValueCalc = collateralAmountNum * collateralAssetData.price
    setCollateralValue(collateralValueCalc)

    const maxBorrowValueCalc = collateralValueCalc * (ltv / 100)
    const maxBorrowAmountCalc = maxBorrowValueCalc / borrowAssetData.price
    setMaxBorrowAmount(maxBorrowAmountCalc)
    setBorrowAmount(maxBorrowAmountCalc / 2) // Default to half of max

    setInterestRate(borrowAssetData.borrowApy)

    // Calculate total repayment
    const interest = borrowAmount * (borrowAssetData.borrowApy / 100) * (term / 365)
    setTotalRepayment(borrowAmount + interest)
  }, [collateralAsset, borrowAsset, collateralAmount, ltv, term, assets])

  const getAiAdvice = async () => {
    if (!address || !collateralAsset || !borrowAsset) return

    setIsAiLoading(true)
    try {
      const result = await getAiLoanRecommendation({
        collateralAsset,
        borrowAsset,
        collateralAmount: Number.parseFloat(collateralAmount),
        ltv,
        term,
        address,
      })

      setAiRecommendation(result)
    } catch (error) {
      console.error("Failed to get AI recommendation:", error)
      setAiRecommendation("Unable to generate recommendation at this time. Please try again later.")
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address || !isCorrectNetwork) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a loan.",
        variant: "destructive",
      })
      return
    }

    if (!collateralAsset || !borrowAsset) {
      toast({
        title: "Missing Assets",
        description: "Please select collateral and borrow assets.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingLoan(true)
    try {
      // Get token addresses
      const collateralTokenAddress = TOKEN_ADDRESSES[collateralAsset] || ""
      const borrowTokenAddress = TOKEN_ADDRESSES[borrowAsset] || ""

      if (!collateralTokenAddress || !borrowTokenAddress) {
        throw new Error("Invalid token selection")
      }

      // Create the loan
      const result = await createLoan({
        collateralAsset: collateralTokenAddress,
        borrowAsset: borrowTokenAddress,
        collateralAmount: collateralAmount,
        borrowAmount: borrowAmount.toString(),
      })

      toast({
        title: "Loan Created",
        description: `Successfully created loan with ${collateralAmount} ${collateralAsset} as collateral.`,
      })

      // Navigate to dashboard
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Error creating loan:", error)
      toast({
        title: "Loan Creation Failed",
        description: error.message || "Failed to create loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingLoan(false)
    }
  }

  return (
    <section id="calculator" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loan Calculator</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Calculate your loan terms and get AI-powered recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Loan Parameters</CardTitle>
                <CardDescription>Configure your loan details to see estimated terms</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="collateralAsset">Collateral Asset</Label>
                      <Select value={collateralAsset} onValueChange={setCollateralAsset} disabled={loading}>
                        <SelectTrigger id="collateralAsset">
                          <SelectValue placeholder="Select asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              {asset.symbol} - {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="borrowAsset">Borrow Asset</Label>
                      <Select value={borrowAsset} onValueChange={setBorrowAsset} disabled={loading}>
                        <SelectTrigger id="borrowAsset">
                          <SelectValue placeholder="Select asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              {asset.symbol} - {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collateralAmount">Collateral Amount</Label>
                    <Input
                      id="collateralAmount"
                      type="number"
                      value={collateralAmount}
                      onChange={(e) => setCollateralAmount(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    <p className="text-sm text-foreground/70">
                      Value: ${collateralValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label htmlFor="ltv">Loan-to-Value Ratio: {ltv}%</Label>
                      <span className="text-sm text-foreground/70">Max: 75%</span>
                    </div>
                    <Slider
                      id="ltv"
                      value={[ltv]}
                      onValueChange={(values) => setLtv(values[0])}
                      min={25}
                      max={75}
                      step={1}
                    />
                    <p className="text-sm text-foreground/70">
                      Higher LTV increases liquidation risk during market volatility
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label htmlFor="term">Loan Term: {term} days</Label>
                    </div>
                    <Slider
                      id="term"
                      value={[term]}
                      onValueChange={(values) => setTerm(values[0])}
                      min={7}
                      max={365}
                      step={1}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      loading || !collateralAsset || !borrowAsset || isCreatingLoan || !address || !isCorrectNetwork
                    }
                  >
                    {isCreatingLoan ? "Creating Loan..." : "Create Loan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Loan Summary</CardTitle>
                <CardDescription>Estimated terms based on current market conditions</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <div className="text-sm text-foreground/70 mb-1">Max Borrow Amount</div>
                      <div className="text-xl font-bold">
                        {maxBorrowAmount.toFixed(4)} {borrowAsset}
                      </div>
                      <div className="text-sm text-foreground/70">
                        $
                        {(maxBorrowAmount * (assets.find((a) => a.symbol === borrowAsset)?.price || 0)).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <div className="text-sm text-foreground/70 mb-1">Interest Rate</div>
                      <div className="text-xl font-bold text-primary">{interestRate.toFixed(2)}%</div>
                      <div className="text-sm text-foreground/70">Annual</div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-foreground/70">Collateral</div>
                      <div className="font-medium">
                        {collateralAmount} {collateralAsset}
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-foreground/70">Borrow Amount</div>
                      <div className="font-medium">
                        {borrowAmount.toFixed(4)} {borrowAsset}
                      </div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-foreground/70">Term</div>
                      <div className="font-medium">{term} days</div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-foreground/70">Interest</div>
                      <div className="font-medium">
                        {(totalRepayment - borrowAmount).toFixed(4)} {borrowAsset}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <div className="font-medium">Total Repayment</div>
                      <div className="font-bold">
                        {totalRepayment.toFixed(4)} {borrowAsset}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={getAiAdvice}
                      disabled={isAiLoading || !address}
                    >
                      {isAiLoading ? "Analyzing..." : "Get AI Recommendation"}
                    </Button>

                    {aiRecommendation && (
                      <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-medium mb-2">AI Recommendation:</h4>
                        <p className="text-sm">{aiRecommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <p className="text-sm text-foreground/70">
                  All loans are secured by your collateral. If the value of your collateral falls below the required
                  threshold, it may be liquidated to repay the loan.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

