import { ethers } from "ethers"
import { getProvider, getSigner } from "./web3"

// ABI for ERC20 token standard
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint amount) returns (bool)",
  "function transferFrom(address from, address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)",
]

// ABI for Lending Protocol (simplified for demo)
const LENDING_PROTOCOL_ABI = [
  "function getMarkets() view returns (address[])",
  "function getMarketData(address token) view returns (uint256 supplyRate, uint256 borrowRate, uint256 totalSupply, uint256 totalBorrow, uint256 exchangeRate)",
  "function supply(address token, uint256 amount) returns (bool)",
  "function withdraw(address token, uint256 amount) returns (bool)",
  "function borrow(address token, uint256 amount) returns (bool)",
  "function repay(address token, uint256 amount) returns (bool)",
  "function getAccountData(address account) view returns (uint256 totalSupplyValue, uint256 totalBorrowValue, uint256 healthFactor)",
  "function getAccountAssets(address account) view returns (address[])",
  "function getAccountAssetData(address account, address asset) view returns (uint256 supplied, uint256 borrowed)",
]

// Token addresses on Rootstock (replace with actual addresses)
export const TOKEN_ADDRESSES = {
  RBTC: "0x0000000000000000000000000000000000000000", // Native token
  DOC: "0xe700691da7b9851f2f35f8b8182c69c53ccad9db", // Dollar on Chain
  RIF: "0x2acc95758f8b5f583470ba265eb685a8f45fc9d5", // RIF Token
  RDOC: "0x2d919f19d4892381d58edebeca66d5642cef1a1f", // RIF Dollar on Chain
  SOV: "0xefc78fc7d48b64958315949279ba181c2114abbd", // Sovryn Token
}

// Lending protocol address (replace with actual address)
export const LENDING_PROTOCOL_ADDRESS = "0x1234567890123456789012345678901234567890" // Placeholder

// Get ERC20 token contract
export function getTokenContract(tokenAddress: string, withSigner = false) {
  const provider = getProvider()
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)

  if (withSigner) {
    return getSigner().then((signer) => contract.connect(signer))
  }

  return contract
}

// Get lending protocol contract
export function getLendingProtocolContract(withSigner = false) {
  const provider = getProvider()
  const contract = new ethers.Contract(LENDING_PROTOCOL_ADDRESS, LENDING_PROTOCOL_ABI, provider)

  if (withSigner) {
    return getSigner().then((signer) => contract.connect(signer))
  }

  return contract
}

// Format token amount based on decimals
export async function formatTokenAmount(tokenAddress: string, amount: ethers.BigNumberish) {
  const tokenContract = getTokenContract(tokenAddress)
  const decimals = await tokenContract.decimals()
  return ethers.formatUnits(amount, decimals)
}

// Parse token amount based on decimals
export async function parseTokenAmount(tokenAddress: string, amount: string) {
  const tokenContract = getTokenContract(tokenAddress)
  const decimals = await tokenContract.decimals()
  return ethers.parseUnits(amount, decimals)
}

// Get token balance
export async function getTokenBalance(tokenAddress: string, accountAddress: string) {
  if (tokenAddress === TOKEN_ADDRESSES.RBTC) {
    const provider = getProvider()
    const balance = await provider.getBalance(accountAddress)
    return ethers.formatEther(balance)
  } else {
    const tokenContract = getTokenContract(tokenAddress)
    const balance = await tokenContract.balanceOf(accountAddress)
    return formatTokenAmount(tokenAddress, balance)
  }
}

// Approve tokens for lending protocol
export async function approveTokens(tokenAddress: string, amount: string) {
  const parsedAmount = await parseTokenAmount(tokenAddress, amount)
  const tokenContract = await getTokenContract(tokenAddress, true)

  const tx = await tokenContract.approve(LENDING_PROTOCOL_ADDRESS, parsedAmount)
  return tx.wait()
}

// Supply tokens to lending protocol
export async function supplyTokens(tokenAddress: string, amount: string) {
  const parsedAmount = await parseTokenAmount(tokenAddress, amount)
  const lendingContract = await getLendingProtocolContract(true)

  const tx = await lendingContract.supply(tokenAddress, parsedAmount)
  return tx.wait()
}

// Withdraw tokens from lending protocol
export async function withdrawTokens(tokenAddress: string, amount: string) {
  const parsedAmount = await parseTokenAmount(tokenAddress, amount)
  const lendingContract = await getLendingProtocolContract(true)

  const tx = await lendingContract.withdraw(tokenAddress, parsedAmount)
  return tx.wait()
}

// Borrow tokens from lending protocol
export async function borrowTokens(tokenAddress: string, amount: string) {
  const parsedAmount = await parseTokenAmount(tokenAddress, amount)
  const lendingContract = await getLendingProtocolContract(true)

  const tx = await lendingContract.borrow(tokenAddress, parsedAmount)
  return tx.wait()
}

// Repay borrowed tokens
export async function repayTokens(tokenAddress: string, amount: string) {
  const parsedAmount = await parseTokenAmount(tokenAddress, amount)
  const lendingContract = await getLendingProtocolContract(true)

  const tx = await lendingContract.repay(tokenAddress, parsedAmount)
  return tx.wait()
}

