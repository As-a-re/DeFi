"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, PiggyBank, TrendingUp } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { fetchUserAssets, fetchUserLoans } from "@/lib/blockchain"
import Loading from "@/components/loading"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { supplyTokens, withdrawTokens, repayTokens } from "@/lib/contracts"

interface Asset {
  symbol: string
  name: string
  balance: number
  value: number
  apy: number
}

interface Loan {
  id: string
  asset: string
  amount: number
  collateral: string
  collateralAmount: number
  interest: number
  term: number
  startDate: number
}

export default function Dashboard() {
  const { address, isCorrectNetwork } = useWeb3()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [totalDebt, setTotalDebt] = useState(0)

  // Dialog states
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isRepayOpen, setIsRepayOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [actionAmount, setActionAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!address || !isCorrectNetwork) return

      setLoading(true)
      try {
        const userAssets = await fetchUserAssets(address)
        const userLoans = await fetchUserLoans(address)

        setAssets(userAssets)
        setLoans(userLoans)

        // Calculate totals
        const assetsValue = userAssets.reduce((sum, asset) => sum + asset.value, 0)
        const loansValue = userLoans.reduce((sum, loan) => sum + loan.amount, 0)

        setTotalValue(assetsValue)
        setTotalDebt(loansValue)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        toast({
          title: "Error Loading Data",
          description: "Failed to load your financial data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [address, isCorrectNetwork])

  const handleDeposit = async () => {
    if (!selectedAsset || !actionAmount) return

    setIsProcessing(true)
    try {
      await supplyTokens(selectedAsset.symbol, actionAmount)

      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${actionAmount} ${selectedAsset.symbol}`,
      })

      // Refresh data
      const userAssets = await fetchUserAssets(address!)
      setAssets(userAssets)
      setTotalValue(userAssets.reduce((sum, asset) => sum + asset.value, 0))

      // Close dialog
      setIsDepositOpen(false)
      setActionAmount("")
    } catch (error) {
      console.error("Deposit error:", error)
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to deposit assets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWithdraw = async () => {
    if (!selectedAsset || !actionAmount) return

    setIsProcessing(true)
    try {
      await withdrawTokens(selectedAsset.symbol, actionAmount)

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${actionAmount} ${selectedAsset.symbol}`,
      })

      // Refresh data
      const userAssets = await fetchUserAssets(address!)
      setAssets(userAssets)
      setTotalValue(userAssets.reduce((sum, asset) => sum + asset.value, 0))

      // Close dialog
      setIsWithdrawOpen(false)
      setActionAmount("")
    } catch (error) {
      console.error("Withdrawal error:", error)
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw assets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRepay = async () => {
    if (!selectedLoan || !actionAmount) return

    setIsProcessing(true)
    try {
      await repayTokens(selectedLoan.asset, actionAmount)

      toast({
        title: "Repayment Successful",
        description: `Successfully repaid ${actionAmount} ${selectedLoan.asset}`,
      })

      // Refresh data
      const userLoans = await fetchUserLoans(address!)
      setLoans(userLoans)
      setTotalDebt(userLoans.reduce((sum, loan) => sum + loan.amount, 0))

      // Close dialog
      setIsRepayOpen(false)
      setActionAmount("")
    } catch (error) {
      console.error("Repayment error:", error)
      toast({
        title: "Repayment Failed",
        description: error.message || "Failed to repay loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!address) {
    return (
      <section id="dashboard" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>
            <p className="text-foreground/70">Connect your wallet to view your dashboard</p>
          </div>
        </div>
      </section>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <section id="dashboard" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Wrong Network</h2>
            <p className="text-foreground/70 mb-4">Please switch to the Rootstock network to use this application.</p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="dashboard" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>
            <p className="text-foreground/70">Loading your financial data...</p>
          </div>
          <Loading />
        </div>
      </section>
    )
  }

  return (
    <section id="dashboard" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Dashboard</h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">Manage your assets and loans on Rootstock</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">Total Assets</span>
                </div>
                <div className="text-2xl font-bold">
                  ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+2.5% (24h)</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">Total Debt</span>
                </div>
                <div className="text-2xl font-bold">
                  ${totalDebt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>+0.8% (24h)</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <PiggyBank className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/70">Net Position</span>
                </div>
                <div className="text-2xl font-bold">
                  ${(totalValue - totalDebt).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center mt-2 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Health: {totalDebt === 0 ? "Excellent" : totalValue / totalDebt > 2 ? "Good" : "Caution"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="assets">Your Assets</TabsTrigger>
              <TabsTrigger value="loans">Your Loans</TabsTrigger>
            </TabsList>

            <TabsContent value="assets">
              <Card>
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                  <CardDescription>Your deposited assets earning interest on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {assets.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-foreground/70 mb-4">You don't have any assets deposited yet</p>
                      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                        <DialogTrigger asChild>
                          <Button>Deposit Assets</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Deposit Assets</DialogTitle>
                            <DialogDescription>Deposit your assets to start earning interest</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="asset">Asset</Label>
                              <Select
                                onValueChange={(value) =>
                                  setSelectedAsset(assets.find((a) => a.symbol === value) || null)
                                }
                              >
                                <SelectTrigger>
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
                            <div className="grid gap-2">
                              <Label htmlFor="amount">Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={actionAmount}
                                onChange={(e) => setActionAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleDeposit} disabled={isProcessing || !selectedAsset || !actionAmount}>
                              {isProcessing ? "Processing..." : "Deposit"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-2">Asset</th>
                            <th className="text-right py-4 px-2">Balance</th>
                            <th className="text-right py-4 px-2">Value (USD)</th>
                            <th className="text-right py-4 px-2">APY</th>
                            <th className="text-right py-4 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assets.map((asset, index) => (
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
                              <td className="text-right py-4 px-2">{asset.balance.toFixed(6)}</td>
                              <td className="text-right py-4 px-2">
                                ${asset.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </td>
                              <td className="text-right py-4 px-2 text-green-500">{asset.apy.toFixed(2)}%</td>
                              <td className="text-right py-4 px-2">
                                <div className="flex justify-end space-x-2">
                                  <Dialog
                                    open={isWithdrawOpen && selectedAsset?.symbol === asset.symbol}
                                    onOpenChange={(open) => {
                                      setIsWithdrawOpen(open)
                                      if (open) setSelectedAsset(asset)
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        Withdraw
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Withdraw {asset.symbol}</DialogTitle>
                                        <DialogDescription>
                                          Withdraw your {asset.symbol} from the platform
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="amount">Amount</Label>
                                          <Input
                                            id="amount"
                                            type="number"
                                            value={actionAmount}
                                            onChange={(e) => setActionAmount(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            max={asset.balance.toString()}
                                            step="0.01"
                                          />
                                          <p className="text-sm text-foreground/70">
                                            Available: {asset.balance.toFixed(6)} {asset.symbol}
                                          </p>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button onClick={handleWithdraw} disabled={isProcessing || !actionAmount}>
                                          {isProcessing ? "Processing..." : "Withdraw"}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAsset(asset)
                                      // Navigate to loan calculator
                                      document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
                                    }}
                                  >
                                    Borrow
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loans">
              <Card>
                <CardHeader>
                  <CardTitle>Loans</CardTitle>
                  <CardDescription>Your active loans and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {loans.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-foreground/70 mb-4">You don't have any active loans</p>
                      <Button
                        onClick={() => {
                          // Navigate to loan calculator
                          document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Take a Loan
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-2">Asset</th>
                            <th className="text-right py-4 px-2">Borrowed</th>
                            <th className="text-right py-4 px-2">Collateral</th>
                            <th className="text-right py-4 px-2">Interest</th>
                            <th className="text-right py-4 px-2">Term</th>
                            <th className="text-right py-4 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loans.map((loan) => (
                            <tr key={loan.id} className="border-b">
                              <td className="py-4 px-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                    {loan.asset.charAt(0)}
                                  </div>
                                  <div className="font-medium">{loan.asset}</div>
                                </div>
                              </td>
                              <td className="text-right py-4 px-2">
                                ${loan.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </td>
                              <td className="text-right py-4 px-2">
                                {loan.collateralAmount.toFixed(4)} {loan.collateral}
                              </td>
                              <td className="text-right py-4 px-2">{loan.interest.toFixed(2)}%</td>
                              <td className="text-right py-4 px-2">
                                {Math.floor((Date.now() - loan.startDate) / (24 * 60 * 60 * 1000))} / {loan.term} days
                              </td>
                              <td className="text-right py-4 px-2">
                                <Dialog
                                  open={isRepayOpen && selectedLoan?.id === loan.id}
                                  onOpenChange={(open) => {
                                    setIsRepayOpen(open)
                                    if (open) setSelectedLoan(loan)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button size="sm">Repay</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Repay Loan</DialogTitle>
                                      <DialogDescription>Repay your {loan.asset} loan</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                          id="amount"
                                          type="number"
                                          value={actionAmount}
                                          onChange={(e) => setActionAmount(e.target.value)}
                                          placeholder="0.00"
                                          min="0"
                                          max={loan.amount.toString()}
                                          step="0.01"
                                        />
                                        <p className="text-sm text-foreground/70">
                                          Outstanding: {loan.amount.toFixed(2)} {loan.asset}
                                        </p>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={handleRepay} disabled={isProcessing || !actionAmount}>
                                        {isProcessing ? "Processing..." : "Repay"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

