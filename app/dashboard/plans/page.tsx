"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import WithdrawModal from "@/components/WithdrawModal";
import TopUpModal from "@/components/TopUpModal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getSaving, getUserChildContract, getUserVaultNames } from "@/lib/onchain";
import { BASE_CONTRACT_ADDRESS, CELO_CONTRACT_ADDRESS } from "@/lib/constants";
import { config } from "@/app/providers";

// Initialize the Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

// Define types for our plan data
interface Plan {
  id: string;
  address: string;
  name: string;
  currentAmount: string;
  targetAmount: string;
  progress: number;
  isEth: boolean;
  isGToken?: boolean;
  isUSDGLO?: boolean; // Add this property
  startTime: number;
  maturityTime: number;
  penaltyPercentage: number;
  tokenName?: string;
  tokenLogo?: string;
  network?: string; // Add network field
}

interface SavingsData {
  totalLocked: string;
  deposits: number;
  rewards: string;
  currentPlans: Plan[];
  completedPlans: Plan[];
}

// Helper to get logo for a token
function getTokenLogo(tokenName: string, tokenLogo?: string) {
  if (tokenLogo) return tokenLogo;
  if (tokenName === "cUSD") return "/cusd.png";
  if (tokenName === "USDGLO") return "/usdglo.png";
  if (tokenName === "Gooddollar" || tokenName === "$G") return "/$g.png";
  if (tokenName === "USDC") return "/usdc.png";
  return `/${tokenName.toLowerCase()}.png`;
}

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpPlan, setTopUpPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [ethPrice, setEthPrice] = useState(3500); // Default ETH price
  const [goodDollarPrice, setGoodDollarPrice] = useState(0.0001);
  const [savingsData, setSavingsData] = useState<SavingsData>({
    totalLocked: "0.00",
    deposits: 0,
    rewards: "0.00",
    currentPlans: [],
    completedPlans: [],
  });

  const { address, isConnected } = useAccount();

  // Function to fetch current ETH price
  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      );
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return null;
    }
  };

  // Fetch GoodDollar price from Coingecko
  const fetchGoodDollarPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=gooddollar&vs_currencies=usd",
      );
      const data = await response.json();
      return data.gooddollar.usd;
    } catch (error) {
      console.error("Error fetching GoodDollar price:", error);
      return 0.0001; // fallback
    }
  };

  const fetchSavingsData = async () => {
    if (!isConnected || !address) return;
    try {
      setIsLoading(true);
      const currentEthPrice = await fetchEthPrice();
      console.log(`Current ETH price: ${currentEthPrice}`);
      setEthPrice(currentEthPrice || 3500);

      // Check if on Base or Celo network
      const network = config.state;
      const BASE_CHAIN_ID = 8453; // Base network chainId
      const CELO_CHAIN_ID = 42220; // Celo network chainId

      if (network.chainId !== BASE_CHAIN_ID && network.chainId !== CELO_CHAIN_ID) {
        setIsCorrectNetwork(false);
        setIsLoading(false);
        return;
      }

      setIsCorrectNetwork(true);

      // Determine which contract address to use based on the network
      const isBase = network.chainId === BASE_CHAIN_ID;
      const contractAddress = isBase ? BASE_CONTRACT_ADDRESS : CELO_CONTRACT_ADDRESS;

      // Get user's child contract address
      const userChildContractAddress = await getUserChildContract(contractAddress, address);

      if (userChildContractAddress === ethers.ZeroAddress) {
        // User hasn't joined BitSave yet
        setSavingsData({
          totalLocked: "0.00",
          deposits: 0,
          rewards: "0.00",
          currentPlans: [],
          completedPlans: [],
        });
        setIsLoading(false);
        return;
      }

      // Get savings names from the child contract
      const savingsNamesArray = await getUserVaultNames(userChildContractAddress, network.chainId);

      // Change 'let' to 'const' for variables that aren't reassigned
      const currentPlans = [];
      const completedPlans = [];
      // Remove or change to const since it's not used
      // const totalLockedValue = ethers.parseEther("0");
      let totalDeposits = 0;
      let totalUsdValue = 0;

      // Process each savings plan
      if (Array.isArray(savingsNamesArray)) {
        // Create a Set to track processed plan names and avoid duplicates
        const processedPlanNames = new Set();

        for (const savingName of savingsNamesArray) {
          try {
            // Skip if we've already processed this plan name
            if (processedPlanNames.has(savingName)) continue;

            // Add to processed set
            processedPlanNames.add(savingName);

            // Get saving details
            const savingData = await getSaving(
              userChildContractAddress,
              savingName,
              network.chainId,
            );
            if (!savingData.isValid) continue;

            // Check if it's ETH or token based
            const tokenId = savingData.tokenId;
            const isEth = tokenId === "0x0000000000000000000000000000000000000000";
            // Check if this is a $G token plan
            const isGToken =
              tokenId.toLowerCase() === "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A".toLowerCase();
            // Check if this is a USDGLO token plan
            const isUSDGLO =
              tokenId.toLowerCase() === "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3".toLowerCase();

            // Get decimals based on token type
            // ETH and $G use 18 decimals, USDGLO and USDC use 6 decimals, cUSD uses 18 decimals
            const decimals =
              isEth || isGToken || (network.chainId !== BASE_CHAIN_ID && !isUSDGLO) ? 18 : 6;

            // Extract penalty percentage from saving data
            const penaltyPercentage = Number(savingData.penaltyPercentage);

            // Format amounts
            const targetFormatted = ethers.formatUnits(savingData.amount, decimals);
            // Use amount as the current deposited amount (not interestAccumulated)
            const currentFormatted = ethers.formatUnits(savingData.amount, decimals);

            const currentDate = new Date();
            const startTimestamp = Number(savingData.startTime);
            const maturityTimestamp = Number(savingData.maturityTime);
            const startDate = new Date(startTimestamp * 1000);
            const maturityDate = new Date(maturityTimestamp * 1000);

            const totalDuration = maturityDate.getTime() - startDate.getTime();
            const elapsedTime = currentDate.getTime() - startDate.getTime();
            const progress = Math.min(Math.floor((elapsedTime / totalDuration) * 100), 100);

            // Add to total USD value using current deposited amount
            if (isEth) {
              const ethAmount = parseFloat(currentFormatted);
              const usdValue = ethAmount * currentEthPrice;
              console.log(
                `ETH plan: ${savingName}, deposited: ${ethAmount} ETH, USD value: ${usdValue}, ethPrice: ${currentEthPrice}`,
              );
              totalUsdValue += usdValue;
            } else if (isGToken) {
              // GoodDollar: format using 18 decimals, then multiply by live price
              const gAmount = parseFloat(currentFormatted);
              totalUsdValue += gAmount * goodDollarPrice;
            } else if (isUSDGLO) {
              totalUsdValue += parseFloat(currentFormatted); // USDGLO is 6 decimals, already USD
            } else {
              // cUSD: format using 18 decimals, already USD
              totalUsdValue += parseFloat(currentFormatted);
            }

            totalDeposits++;

            const planData = {
              id: savingName.trim(),
              address: userChildContractAddress,
              name: savingName.trim(),
              currentAmount: currentFormatted,
              targetAmount: targetFormatted,
              progress: progress,
              isEth,
              isGToken,
              isUSDGLO, // Add this property
              startTime: startTimestamp,
              maturityTime: maturityTimestamp,
              penaltyPercentage: penaltyPercentage,
              tokenName: isEth
                ? "ETH"
                : isGToken
                  ? "$G"
                  : isUSDGLO
                    ? "USDGLO"
                    : network.chainId === BASE_CHAIN_ID
                      ? "USDC"
                      : "cUSD",
              tokenLogo: isEth
                ? "/eth.png"
                : isGToken
                  ? "/$g.png"
                  : isUSDGLO
                    ? "/usdglo.png"
                    : network.chainId === BASE_CHAIN_ID
                      ? "/usdc.png"
                      : "/cusd.png",
              network: network.chainId === BASE_CHAIN_ID ? "Base" : "Celo",
            };

            // Add to appropriate list based on completion status
            if (progress >= 100 || currentDate >= maturityDate) {
              completedPlans.push(planData);
            } else {
              currentPlans.push(planData);
            }
          } catch (error) {
            console.error(`Error processing savings plan ${savingName}:`, error);
          }
        }
      }

      // Sort plans from newest to oldest based on start time (most recent first)
      currentPlans.sort((a, b) => b.startTime - a.startTime);
      completedPlans.sort((a, b) => b.startTime - a.startTime);

      console.log(`Total USD value before setting state: ${totalUsdValue}`);
      setSavingsData({
        totalLocked: totalUsdValue.toFixed(2),
        deposits: totalDeposits,
        rewards: "0.00", // Placeholder for rewards calculation
        currentPlans,
        completedPlans,
      });
    } catch (error) {
      console.error("Error fetching savings data:", error);
      setSavingsData({
        totalLocked: "0.00",
        deposits: 0,
        rewards: "0.00",
        currentPlans: [],
        completedPlans: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingsData();
  }, [isConnected, address]);

  useEffect(() => {
    fetchGoodDollarPrice().then(setGoodDollarPrice);
  }, []);

  // Update the openPlanDetails function to use the Plan type
  const openPlanDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Add a new function to handle top-up
  const openTopUpModal = (e: React.MouseEvent, plan: Plan) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setTopUpPlan(plan);
    setIsTopUpModalOpen(true);
  };

  return (
    <div
      className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-b from-gray-50 to-gray-100`}
    >
      {/* Decorative elements */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-[#81D7B4]/10 rounded-full blur-3xl"></div>
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="fixed top-1/4 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

      {/* Noise texture */}
      <div className="fixed inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Savings Plans</h1>
          <p className="text-gray-600 max-w-2xl">
            Track and manage your savings goals. Create new plans or contribute to existing ones to
            reach your financial targets faster.
          </p>
        </div>

        {/* Network Warning */}
        {!isCorrectNetwork && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Please connect to Base or Celo network to view your savings plans.
              </span>
            </div>
          </div>
        )}

        {/* Create New Plan Button */}
        <div className="mb-8">
          <Link href="/dashboard/create-savings">
            <button className="bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 text-white font-medium py-3 px-6 rounded-xl shadow-[0_4px_10px_rgba(129,215,180,0.3)] hover:shadow-[0_6px_15px_rgba(129,215,180,0.4)] transition-all duration-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Savings Plan
            </button>
          </Link>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsData.currentPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
                onClick={() => openPlanDetails(plan)}
              >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 group-hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.25)] h-full">
                  {/* Card inner shadow for neomorphism effect */}
                  <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>

                  {/* Subtle noise texture */}
                  <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                  {/* Decorative accent */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>

                  <div className="p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="bg-[#81D7B4]/20 rounded-full p-2.5 mr-3 border border-[#81D7B4]/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5 text-[#81D7B4]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(plan.startTime * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/60 shadow-sm">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/20 text-[#163239] text-xs font-medium shadow-sm">
                          <img
                            src={
                              plan.isEth
                                ? "/eth.png"
                                : getTokenLogo(plan.tokenName || "", plan.tokenLogo || "")
                            }
                            alt={plan.isEth ? "ETH" : plan.tokenName}
                            className="w-4 h-4 mr-1"
                          />
                          {plan.isEth
                            ? "ETH"
                            : plan.tokenName === "cUSD"
                              ? "cUSD"
                              : plan.tokenName === "Gooddollar"
                                ? "$G"
                                : plan.tokenName}
                          <span className="mx-1 text-gray-400">|</span>
                          <img
                            src={plan.network === "Base" ? "/base.svg" : "/celo.png"}
                            alt={plan.network}
                            className="w-4 h-4 mr-1"
                          />
                          {plan.network}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-end mb-1.5">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Current Amount</p>
                          <span className="text-base font-bold text-gray-900">
                            {plan.isEth ? (
                              <>
                                {parseFloat(plan.currentAmount).toFixed(4)}{" "}
                                <span className="text-xs font-medium text-gray-500 ml-1">ETH</span>
                              </>
                            ) : plan.isGToken ? (
                              <>
                                {parseFloat(plan.currentAmount).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 6,
                                })}{" "}
                                <span className="text-xs font-medium text-gray-500 ml-1">$G</span>{" "}
                                <span className="text-xs text-gray-400 ml-2">
                                  ($
                                  {(
                                    parseFloat(plan.currentAmount) * goodDollarPrice
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  USD)
                                </span>
                              </>
                            ) : plan.isUSDGLO ? (
                              <>
                                $
                                {Number(
                                  ethers.formatUnits(plan.currentAmount.split(".")[0], 6),
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                <span className="text-xs font-medium text-gray-500 ml-1">
                                  USDGLO
                                </span>
                              </>
                            ) : plan.tokenName === "cUSD" ? (
                              <>
                                ${parseFloat(plan.currentAmount).toFixed(2)}{" "}
                                <span className="text-xs font-medium text-gray-500 ml-1">cUSD</span>
                              </>
                            ) : (
                              <>
                                ${parseFloat(plan.currentAmount).toFixed(2)}{" "}
                                <span className="text-xs font-medium text-gray-500 ml-1">
                                  {plan.tokenName}
                                </span>
                              </>
                            )}
                          </span>
                          {plan.isEth && (
                            <p className="text-xs text-gray-500">
                              ≈ ${(parseFloat(plan.currentAmount) * ethPrice).toFixed(2)}
                            </p>
                          )}
                        </div>
                        {/* Target display removed */}
                      </div>

                      {/* Progress bar with neomorphism effect */}
                      <div className="relative h-2.5 bg-white rounded-full overflow-hidden mb-1.5 shadow-inner">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80 rounded-full shadow-[0_0_6px_rgba(129,215,180,0.5)]"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{plan.progress}% Complete</span>
                        <span className="text-[#81D7B4] font-medium">
                          Matures: {new Date(plan.maturityTime * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-white/70 backdrop-blur-sm text-gray-800 font-medium py-2 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center justify-center"
                        onClick={(e) => openTopUpModal(e, plan)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 mr-1.5 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Top Up
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-[#81D7B4]/90 to-[#81D7B4]/80 text-white font-medium py-2 rounded-xl shadow-[0_2px_8px_rgba(129,215,180,0.3)] hover:shadow-[0_4px_12px_rgba(129,215,180,0.4)] transition-all duration-300 text-sm flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 mr-1.5 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty state card with neomorphism */}
            {savingsData.currentPlans.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="group"
              >
                <Link href="dashboard/create-savings">
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-gray-300/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 group-hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-[#81D7B4]/10 rounded-full p-4 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8 text-[#81D7B4]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Create New Plan</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Start a new savings goal and track your progress
                    </p>
                    <div className="bg-gradient-to-r from-[#81D7B4]/90 to-[#81D7B4]/80 text-white font-medium py-2 px-4 rounded-xl shadow-[0_2px_8px_rgba(129,215,180,0.3)] hover:shadow-[0_4px_12px_rgba(129,215,180,0.4)] transition-all duration-300 text-sm">
                      Get Started
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        )}

        {/* Completed Plans Section */}
        {savingsData.completedPlans.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Completed Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savingsData.completedPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group"
                  onClick={() => openPlanDetails(plan)}
                >
                  <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 group-hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.25)] h-full">
                    <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>

                    <div className="p-6 relative">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="bg-purple-100 rounded-full p-2.5 mr-3 border border-purple-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5 text-purple-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
                            <p className="text-xs text-gray-500">
                              Completed on {new Date(plan.maturityTime * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/60 shadow-sm">
                          <img
                            src={plan.isEth ? "/eth.svg" : "/usdc.svg"}
                            alt={plan.isEth ? "Ethereum" : "USDC"}
                            className="w-3.5 h-3.5 mr-1.5"
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {plan.isEth ? "ETH" : "USDC"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-end mb-1.5">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Final Amount</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {plan.isEth
                                ? `${parseFloat(plan.currentAmount).toFixed(4)} ETH`
                                : `$${parseFloat(plan.currentAmount).toFixed(2)}`}
                            </p>
                          </div>
                        </div>

                        <div className="relative h-2.5 bg-white rounded-full overflow-hidden mb-1.5 shadow-inner">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-[0_0_6px_rgba(168,85,247,0.5)]"
                            style={{ width: "100%" }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">100% Complete</span>
                          <span className="text-purple-500 font-medium">Ready to withdraw</span>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-purple-500/90 to-purple-600/80 text-white font-medium py-2 rounded-xl shadow-[0_2px_8px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_12px_rgba(168,85,247,0.4)] transition-all duration-300 text-sm">
                        Withdraw Funds
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section with Neomorphism */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Savings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Saved Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>

              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2.5 mr-3 border border-blue-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">Total Saved</h3>
              </div>

              <p className="text-3xl font-bold text-gray-800 mb-1">${savingsData.totalLocked}</p>
              <p className="text-sm text-blue-600 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Across all savings plans
              </p>
            </div>

            {/* Total Goals Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>

              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-2.5 mr-3 border border-purple-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-purple-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">Active Goals</h3>
              </div>

              <p className="text-3xl font-bold text-gray-800 mb-1">
                {savingsData.currentPlans.length}
              </p>
              <p className="text-sm text-purple-600 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {savingsData.currentPlans.length > 0
                  ? `${savingsData.currentPlans.length} active plans`
                  : "No active plans"}
              </p>
            </div>

            {/* Rewards Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#81D7B4]/10 rounded-full blur-2xl"></div>

              <div className="flex items-center mb-4">
                <div className="bg-[#81D7B4]/20 rounded-full p-2.5 mr-3 border border-[#81D7B4]/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-[#81D7B4]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800">Total Deposits</h3>
              </div>

              <p className="text-3xl font-bold text-gray-800 mb-1">{savingsData.deposits}</p>
              <p className="text-sm text-[#81D7B4] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {savingsData.deposits > 0
                  ? `${savingsData.deposits} total deposits`
                  : "No deposits yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Savings Tips</h2>
          <div className="bg-gradient-to-br from-[#81D7B4]/10 to-blue-500/5 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="bg-[#81D7B4]/20 rounded-full p-2.5 mr-4 border border-[#81D7B4]/30 flex-shrink-0 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#81D7B4]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Build Your Financial Safety Net
                </h3>
                <p className="text-gray-600">
                  Every dollar saved today is peace of mind for tomorrow. Consistent saving creates
                  a buffer against life&apos;s uncertainties while helping you achieve your most
                  important goals.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2.5 mr-4 border border-blue-200 flex-shrink-0 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Spread Your Financial Wings
                </h3>
                <p className="text-gray-600">
                  Diversifying across assets and networks reduces risk while maximizing potential
                  returns. A balanced savings portfolio protects you against market volatility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <WithdrawModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan.name}
          planId={selectedPlan.address}
          isEth={selectedPlan.isEth}
          penaltyPercentage={selectedPlan.penaltyPercentage}
          tokenName={selectedPlan.tokenName}
          isCompleted={new Date().getTime() >= selectedPlan.maturityTime * 1000}
        />
      )}

      {/* TopUpModal component */}
      {isTopUpModalOpen && topUpPlan && (
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          planName={topUpPlan.name}
          planId={topUpPlan.address}
          isEth={topUpPlan.isEth}
          tokenName={topUpPlan.tokenName}
        />
      )}
    </div>
  );
}
