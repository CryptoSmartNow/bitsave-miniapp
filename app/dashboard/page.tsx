"use client";

import { useState, useEffect } from "react";
import { useAccount, useSwitchChain, useChainId } from "wagmi";
import { base, celo } from "viem/chains";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMiniApp } from "@neynar/react";
import { Space_Grotesk } from "next/font/google";
import TopUpModal from "../../components/TopUpModal";
import WithdrawModal from "../../components/WithdrawModal";
import ShareMiniApp from "../../components/ShareMiniApp";
import axios from "axios";
import sdk from "@farcaster/miniapp-sdk";
import { getSaving, getUserChildContract, getUserVaultNames } from "@/lib/onchain";
import { ethers } from "ethers";
import {
  BASE_CONTRACT_ADDRESS,
  CELO_CONTRACT_ADDRESS,
  CELO_TOKEN_MAP,
  SUPPORTED_CHAINS,
} from "@/lib/constants";
import type { LeaderboardEntry, Update, ReadUpdate, SavingsPlan } from "@/types";
import { getChainLogo, getTokenLogo } from "@/lib/utils";
import EmptyCompletedSavings from "../../components/EmptyCompletedSavings";
import EmptyCurrentSavings from "../../components/EmptyCurrentSavings";
import EmptyReadySavings from "../../components/EmptyReadySavings";
import Loader from "../../components/Loader";
import ActiveSavingPlanCard from "../../components/ActiveSavingPlanCard";
import CompletedSavingPlanCard from "../../components/CompletedSavingPlanCard";
import { usePrices } from "@/components/PriceComponents";

// Initialize the Space Grotesk font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("current");
  const [topUpModal, setTopUpModal] = useState({
    isOpen: false,
    planName: "",
    planId: "",
    isEth: false,
    isGToken: false,
    tokenName: "",
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    title: string;
    content: string;
    date: string;
  } | null>(null);

  // onchain hooks
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const chainId = useChainId();
  // farcaster miniapp hook
  const { context } = useMiniApp();

  // Helper function to get current chain info
  const getCurrentChain = () => {
    if (!mounted) return base; // Safe default for SSR
    return SUPPORTED_CHAINS.find((chain) => chain.id === chainId) || base;
  };

  const [updates, setUpdates] = useState<Array<Update>>([]);

  // price provider
  const { celoPrice, ethPrice, goodDollarPrice } = usePrices();

  // automatically ask user to add miniapp and silently register wallet on connection
  useEffect(() => {
    async function registerUserForNotifications() {
      try {
        console.log("Registering user for notifications");

        try {
          const result = await sdk.actions.addMiniApp();

          console.log("Add miniapp result:", result);
        } catch (error) {
          console.error("Error adding miniapp:", error);
        }

        const response = await fetch("/api/wallet/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: address,
            fid: context?.user.fid,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register wallet");
        }

        console.log("Wallet registered successfully");
      } catch (error) {
        console.error("Error registering user for notifications:", error);
      }
    }

    setTimeout(() => {
      isConnected && !!address && registerUserForNotifications();
    }, 1000);
  }, [isConnected, address]);

  // Effect to handle chain changes and refetch data
  useEffect(() => {
    if (mounted && address && chainId && !isSwitchingChain) {
      console.log("Chain changed, refetching data for chain:", chainId);
      console.log("Current chain name:", getCurrentChain().name);

      // Clear existing data first to show fresh loading state
      setSavingsData({
        totalLocked: "0.00",
        deposits: 0,
        rewards: "0.00",
        currentPlans: [],
        readyPlans: [],
        completedPlans: [],
      });

      // Add a small delay to ensure the chain switch is complete
      const timer = setTimeout(() => {
        fetchSavingsData();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [chainId, mounted, address, isSwitchingChain]);

  // Function to fetch all updates
  const fetchAllUpdates = async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch("https://bitsaveapi.vercel.app/updates/", {
        method: "GET",
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch updates");
      }

      const allUpdates = await response.json();

      // If user is connected, fetch read status with timeout
      if (address) {
        try {
          const userController = new AbortController();
          const userTimeoutId = setTimeout(() => userController.abort(), 4000);

          const userResponse = await fetch(
            `https://bitsaveapi.vercel.app/updates/user/${address}`,
            {
              method: "GET",
              headers: {
                "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
              },
              signal: userController.signal,
            },
          );

          clearTimeout(userTimeoutId);

          if (userResponse.ok) {
            const userReadUpdates = (await userResponse.json()) as ReadUpdate[];

            // Mark updates as read or unread based on user data
            const processedUpdates = allUpdates.map((update: Update) => {
              const isRead = userReadUpdates.some(
                (readUpdate: ReadUpdate) => readUpdate.id === update.id && !readUpdate.isNew,
              );
              return {
                ...update,
                isNew: !isRead,
              };
            });

            setUpdates(processedUpdates);
          } else {
            // If user endpoint fails, assume all updates are new
            setUpdates(allUpdates.map((update: Update) => ({ ...update, isNew: true })));
          }
        } catch {
          console.log("User updates fetch failed, using default state");
          setUpdates(allUpdates.map((update: Update) => ({ ...update, isNew: true })));
        }
      } else {
        // If no user connected, assume all updates are new
        setUpdates(allUpdates.map((update: Update) => ({ ...update, isNew: true })));
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Updates fetch was aborted due to timeout");
      } else {
        console.error("Error fetching updates:", error);
      }
      setUpdates([]);
    }
  };

  // Function to mark an update as read
  const markUpdateAsRead = async (updateId: string) => {
    if (!address) return;

    try {
      const response = await fetch(`https://bitsaveapi.vercel.app/updates/${updateId}/read`, {
        method: "PUT",
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useraddress: address,
        }),
      });

      if (response.ok) {
        // Update local state to reflect the change
        setUpdates((prevUpdates) =>
          prevUpdates.map((update) =>
            update.id === updateId ? { ...update, isNew: false } : update,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking update as read:", error);
    }
  };

  const [savingsData, setSavingsData] = useState({
    totalLocked: "0.00",
    deposits: 0,
    rewards: "0.00",
    currentPlans: [] as Array<SavingsPlan>,
    readyPlans: [] as Array<SavingsPlan>,
    completedPlans: [] as Array<SavingsPlan>,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  const openUpdateModal = (update: Update) => {
    setSelectedUpdate(update);
    setShowUpdateModal(true);

    // Mark as read if it's new
    if (update.isNew) {
      markUpdateAsRead(update.id);
    }
  };

  useEffect(() => {
    if (mounted) {
      // Fetch updates in parallel with other data
      fetchAllUpdates();
    }
  }, [mounted, address]);

  // Function to close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };

  // Add useEffect to handle clicking outside the notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const notificationButton = document.getElementById("notification-button");
      const notificationDropdown = document.getElementById("notification-dropdown");
      const chainDropdown = document.getElementById("chain-dropdown");

      if (
        showNotifications &&
        notificationButton &&
        notificationDropdown &&
        !notificationButton.contains(event.target as Node) &&
        !notificationDropdown.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      // Close chain dropdown when clicking outside
      if (
        chainDropdown &&
        !chainDropdown.contains(event.target as Node) &&
        !chainDropdown.classList.contains("hidden")
      ) {
        chainDropdown.classList.add("hidden");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const readyMiniapp = async () => {
      await sdk.actions.ready();
      setMounted(true);

      // Start fetching data in background without blocking UI
      if (isConnected && address && chainId) {
        fetchSavingsData();
      }
    };
    if (sdk && !mounted) {
      readyMiniapp();
    }
  }, []);

  // Also trigger data fetch when connection state changes
  useEffect(() => {
    if (mounted && isConnected && address && chainId && !isSwitchingChain) {
      // Small delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        fetchSavingsData();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mounted, isConnected, address, chainId, isSwitchingChain]);

  const fetchSavingsData = async () => {
    console.log("=== Starting fetchSavingsData ===");
    console.log("isConnected:", isConnected);
    console.log("address:", address);
    console.log("chainId:", chainId);
    console.log("Current chain:", getCurrentChain().name);

    if (!isConnected || !address || !chainId) {
      console.log("Missing required data for fetch");
      return;
    }

    try {
      setIsLoading(true);

      setSavingsData({
        totalLocked: "0.00",
        deposits: 0,
        rewards: "0.00",
        currentPlans: [],
        readyPlans: [],
        completedPlans: [],
      });

      // Fetch ETH price in parallel with wallet setup
      const currentEthPrice = ethPrice;
      console.log("======================= current eth price", ethPrice);

      console.log(`Current ETH price: ${currentEthPrice}`);

      const BASE_CHAIN_ID = base.id;
      const CELO_CHAIN_ID = celo.id;

      console.log("============================== current chain", chainId);
      console.log("Base chain ID:", BASE_CHAIN_ID);
      console.log("Celo chain ID:", CELO_CHAIN_ID);

      if (chainId !== BASE_CHAIN_ID && chainId !== CELO_CHAIN_ID) {
        console.log("Not on supported network, setting isCorrectNetwork to false");
        setIsCorrectNetwork(false);
        setIsLoading(false);
        return;
      }

      console.log("On supported network, proceeding with data fetch");
      setIsCorrectNetwork(true);

      const contractAddress =
        chainId === BASE_CHAIN_ID ? BASE_CONTRACT_ADDRESS : CELO_CONTRACT_ADDRESS;

      console.log("Using contract address:", contractAddress);

      // Get user's child contract with timeout
      let userChildContractAddress;
      try {
        // Add timeout to prevent hanging
        userChildContractAddress = await getUserChildContract(contractAddress, address, chainId);

        console.log("User child contract address:", userChildContractAddress);

        if (!userChildContractAddress || userChildContractAddress === ethers.ZeroAddress) {
          console.log("User doesn't have a child contract yet");
          setSavingsData({
            totalLocked: "0.00",
            deposits: 0,
            rewards: "0.00",
            currentPlans: [],
            readyPlans: [],
            completedPlans: [],
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error getting user child contract:", error);
        setSavingsData({
          totalLocked: "0.00",
          deposits: 0,
          rewards: "0.00",
          currentPlans: [],
          readyPlans: [],
          completedPlans: [],
        });
        setIsLoading(false);
        return;
      }

      // Get savings names
      const savingsNamesArray = await getUserVaultNames(userChildContractAddress, chainId);
      console.log("Savings names:", savingsNamesArray);

      const currentPlans = [];
      const readyPlans = [];
      const completedPlans = [];
      let totalDeposits = 0;
      let totalUsdValue = 0;
      const processedPlanNames = new Set();

      // Limit concurrent processing to prevent overwhelming the RPC
      const BATCH_SIZE = 3;
      const validSavingNames = savingsNamesArray.filter(
        (savingName: string) =>
          savingName &&
          typeof savingName === "string" &&
          savingName !== "" &&
          !processedPlanNames.has(savingName),
      );

      for (let i = 0; i < validSavingNames.length; i += BATCH_SIZE) {
        const batch = validSavingNames.slice(i, i + BATCH_SIZE);

        // Process batch in parallel
        const batchPromises = batch.map(async (savingName: string) => {
          try {
            processedPlanNames.add(savingName);
            console.log("Fetching data for:", savingName);

            // get saving plan data
            const savingData = await getSaving(userChildContractAddress, savingName, chainId);
            console.log("savingData for", savingName, ":", savingData);

            return { savingName, savingData };
          } catch (err) {
            console.error(`Failed to fetch data for "${savingName}":`, err);
            return null;
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);

        console.log("Batch results", batchResults);

        // Process successful results
        for (const result of batchResults) {
          if (result.status === "fulfilled" && result.value) {
            const { savingName, savingData } = result.value;

            console.log("processing..", savingName, savingData);

            try {
              // if (!savingData?.isValid) continue;

              const tokenId = savingData.tokenId;
              const isEth = tokenId.toLowerCase() === ethers.ZeroAddress.toLowerCase();

              let tokenName = "USDC";
              let decimals = 6;
              let tokenLogo = "/usdc.png";

              console.log("... saving data", savingData);

              if (isEth) {
                tokenName = "ETH";
                decimals = 18;
                tokenLogo = "/eth.png";
              } else if (chainId === CELO_CHAIN_ID) {
                const tokenInfo = CELO_TOKEN_MAP[(tokenId as string).toLowerCase()];
                if (tokenInfo) {
                  tokenName = tokenInfo.name;
                  decimals = tokenInfo.decimals;
                  tokenLogo = tokenInfo.logo;
                } else {
                  tokenName = "USDGLO";
                  decimals = 6;
                  tokenLogo = "/usdglo.png";
                }
              } else if (chainId === BASE_CHAIN_ID) {
                if (tokenId.toLowerCase() === "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913") {
                  tokenName = "USDC";
                  decimals = 6;
                  tokenLogo = "/usdc.png";
                }
              }
              console.log("Savings Name Array:", savingsNamesArray);

              const targetFormatted = ethers.formatUnits(savingData.amount, decimals);
              // Use amount as the current deposited amount (not interestAccumulated)
              const currentFormatted = ethers.formatUnits(savingData.amount, decimals);

              const now = Date.now();
              const startTime = Number(savingData.startTime) * 1000;
              const maturityTime = Number(savingData.maturityTime) * 1000;

              const progress = Math.min(
                Math.floor(((now - startTime) / (maturityTime - startTime)) * 100),
                100,
              );
              const penaltyPercentage = Number(savingData.penaltyPercentage);

              console.log(
                `Processing token: ${tokenName}, deposited: ${currentFormatted}, goodDollarPrice: ${goodDollarPrice}`,
              );

              if (isEth) {
                const ethAmount = parseFloat(currentFormatted);
                const ethUsdValue = ethAmount * currentEthPrice;
                console.log(`ETH: ${ethAmount} * ${currentEthPrice} = ${ethUsdValue}`);
                totalUsdValue += ethUsdValue;
              } else if (tokenName === "Gooddollar") {
                // GoodDollar: format using 18 decimals, then multiply by live price
                const gAmount = parseFloat(currentFormatted);
                const gUsdValue = gAmount * goodDollarPrice;
                console.log(`GoodDollar: ${gAmount} * ${goodDollarPrice} = ${gUsdValue}`);
                totalUsdValue += gUsdValue;
              } else if (tokenName === "USDGLO") {
                const usdgloValue = parseFloat(currentFormatted);
                console.log(`USDGLO: ${usdgloValue}`);
                totalUsdValue += usdgloValue; // USDGLO is 6 decimals, already USD
              } else if (tokenName === "cUSD") {
                const cusdValue = parseFloat(currentFormatted);
                console.log(`cUSD: ${cusdValue}`);
                totalUsdValue += cusdValue; // cUSD is 18 decimals, already USD
              } else {
                const otherValue = parseFloat(currentFormatted);
                console.log(`Other token (${tokenName}): ${otherValue}`);
                totalUsdValue += otherValue;
              }

              totalDeposits++;

              const planData = {
                id: savingName.trim(),
                address: userChildContractAddress,
                name: savingName.trim(),
                currentAmount: currentFormatted,
                targetAmount: targetFormatted,
                progress,
                isEth,
                startTime: startTime / 1000,
                maturityTime: maturityTime / 1000,
                penaltyPercentage,
                tokenName,
                tokenLogo,
              };

              savingData?.isValid && progress < 100 && currentPlans.push(planData);
              savingData?.isValid && progress >= 100 && readyPlans.push(planData);
              !savingData?.isValid && completedPlans.push(planData);
            } catch (err) {
              console.error(`Failed to process plan "${savingName}":`, err);
            }
          }
        }
      }

      // Sort by most recent
      currentPlans.sort((a, b) => b.startTime - a.startTime);
      completedPlans.sort((a, b) => b.startTime - a.startTime);

      // Calculate total BTS rewards (0.5% of total USD value times 1000)
      const totalBtsRewards = (totalUsdValue * 0.005 * 1000).toFixed(2);

      setSavingsData({
        totalLocked: totalUsdValue.toFixed(2),
        deposits: totalDeposits,
        rewards: totalBtsRewards,
        currentPlans,
        readyPlans,
        completedPlans,
      });
    } catch (error) {
      console.error("Unhandled error in fetch_SavingsData:", error);
      // Set empty data on error to prevent infinite loading
      setSavingsData({
        totalLocked: "0.00",
        deposits: 0,
        rewards: "0.00",
        currentPlans: [],
        readyPlans: [],
        completedPlans: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openTopUpModal = (plan: SavingsPlan) => {
    setTopUpModal({
      isOpen: true,
      planName: plan.name,
      planId: plan.id,
      isEth: plan.isEth,
      isGToken: plan.tokenName === "$G",
      tokenName: plan.tokenName,
    });
  };

  const closeTopUpModal = () => {
    setTopUpModal({
      isOpen: false,
      planName: "",
      planId: "",
      isEth: false,
      isGToken: false,
      tokenName: "",
    });
  };

  // Callback to refetch data after successful top-up
  const handleTopUpSuccess = () => {
    console.log("Top-up successful, refetching savings data...");

    // Add a small delay to ensure the transaction is processed
    setTimeout(() => {
      fetchSavingsData();
    }, 2000);
  };

  const [withdrawModal, setWithdrawModal] = useState({
    isOpen: false,
    planId: "",
    planName: "",
    isEth: false,
    penaltyPercentage: 0,
    tokenName: "",
    isCompleted: false,
  });

  const openWithdrawModal = (plan: SavingsPlan) => {
    setWithdrawModal({
      isOpen: true,
      planId: plan.id,
      planName: plan.name,
      isEth: plan.isEth,
      penaltyPercentage: plan.penaltyPercentage,
      tokenName: plan.tokenName,
      isCompleted: false,
    });
  };

  const closeWithdrawModal = () => {
    setWithdrawModal({
      isOpen: false,
      planId: "",
      planName: "",
      isEth: false,
      penaltyPercentage: 0,
      tokenName: "",
      isCompleted: false,
    });
  };

  // Callback to refetch data after successful withdrawal
  const handleWithdrawSuccess = () => {
    console.log("Withdrawal successful, refetching savings data...");

    // Add a small delay to ensure the transaction is processed
    setTimeout(() => {
      fetchSavingsData();
    }, 2000);
  };

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    setIsLeaderboardLoading(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch("https://bitsaveapi.vercel.app/leaderboard", {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const data = (await response.json()) as LeaderboardEntry[];

      const rankedData = data
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.totalamount - a.totalamount)
        .slice(0, 4)
        .map((user: LeaderboardEntry, index: number) => ({
          ...user,
          rank: index + 1,
          datetime: new Date().toISOString().split("T")[0],
        }));

      setLeaderboardData(rankedData);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Leaderboard fetch was aborted due to timeout");
      } else {
        console.error("Error fetching leaderboard data:", error);
      }
      setLeaderboardData([]);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      // Fetch leaderboard data in parallel
      fetchLeaderboardData();
    }
  }, [mounted]);

  // Go back home if the user is not connected
  useEffect(() => {
    if (mounted && !isConnecting && !isConnected) {
      router.push("/");
    }
  }, [isConnected, isConnecting, mounted, router]);

  if (!mounted) {
    return (
      <div
        className={`${spaceGrotesk.variable} min-h-screen flex items-center justify-center bg-[#f2f2f2]`}
      >
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
      </div>
    );
  }

  return (
    <div
      className={`${spaceGrotesk.variable} font-sans p-4 sm:p-6 md:p-8 bg-[#f2f2f2] text-gray-800 relative min-h-screen pb-8 overflow-x-hidden`}
    >
      {/* Network Warning Banner - Only show if not on Base or Celo */}
      {mounted && !isCorrectNetwork && address && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-200 z-50 p-3 flex items-center justify-center">
          <div className="flex items-center max-w-4xl mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-yellow-800 text-sm">
              Please switch to Base or Celo network to use BitSave
            </span>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => switchChain({ chainId: base.id })}
                disabled={isSwitchingChain}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium py-1 px-3 rounded-full transition-colors disabled:opacity-70"
              >
                {isSwitchingChain ? "Switching..." : "Switch to Base"}
              </button>
              <button
                onClick={() => switchChain({ chainId: celo.id })}
                disabled={isSwitchingChain}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium py-1 px-3 rounded-full transition-colors disabled:opacity-70"
              >
                {isSwitchingChain ? "Switching..." : "Switch to Celo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={topUpModal.isOpen}
        onClose={closeTopUpModal}
        planName={topUpModal.planName}
        planId={topUpModal.planId}
        isEth={topUpModal.isEth}
        tokenName={topUpModal.tokenName}
        onSuccess={handleTopUpSuccess}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={withdrawModal.isOpen}
        onClose={closeWithdrawModal}
        planName={withdrawModal.planName}
        planId={withdrawModal.planId}
        isEth={withdrawModal.isEth}
        penaltyPercentage={withdrawModal.penaltyPercentage}
        tokenName={withdrawModal.tokenName}
        isCompleted={withdrawModal.isCompleted}
        onSuccess={handleWithdrawSuccess}
      />

      {/* Update Modal */}
      {showUpdateModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden border border-white/60">
            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{selectedUpdate.title}</h3>
                <button
                  onClick={closeUpdateModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                {new Date(selectedUpdate.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="text-gray-700 mb-6">{selectedUpdate.content}</div>

              <button
                onClick={closeUpdateModal}
                className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 rounded-xl shadow-[0_4px_12px_rgba(129,215,180,0.4)] hover:shadow-[0_8px_20px_rgba(129,215,180,0.5)] transition-all duration-300"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grain overlay */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none bg-[url('/noise.jpg')] mix-blend-overlay"></div>

      {/* Decorative elements - adjusted for mobile */}
      <div className="absolute top-20 right-10 md:right-20 w-40 md:w-64 h-40 md:h-64 bg-[#81D7B4]/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 md:left-20 w-40 md:w-80 h-40 md:h-80 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      {/* Header - responsive adjustments */}
      <div className="flex justify-end mr-12 items-center overflow-x-hidden">
        <div className="flex justify-end items-center space-x-3">
          <ShareMiniApp
            variant="minimal"
            size="sm"
            customMessage="💰 Been using BitSave to grow my crypto savings safely! The yields are amazing and I don't worry about market dips anymore 📈"
            className="hidden sm:inline-flex"
          />
          <button
            id="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {updates && updates.some((update) => update.isNew) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#81D7B4] rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>
      <div className="mt-4 mb-6 md:mb-8 space-y-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Welcome back, {mounted ? (context?.user?.username ?? "User") : "User"}
          </p>
        </div>
      </div>

      {/* Notifications dropdown - improved positioning for mobile */}
      {showNotifications && (
        <div className="fixed right-4 md:right-4 top-20 w-[calc(100vw-2rem)] md:w-80 max-w-sm bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/60 z-[9999] overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Updates</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {updates && updates.length > 0 ? (
              updates.map((update) => (
                <button
                  key={update.id}
                  onClick={() => openUpdateModal(update)}
                  className="w-full text-left p-4 hover:bg-[#81D7B4]/5 border-b border-gray-100 last:border-b-0 transition-colors relative"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm">{update.title}</h4>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{update.content}</p>
                      <span className="text-gray-400 text-xs mt-2 block">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                    </div>
                    {update.isNew && (
                      <span className="bg-[#81D7B4] text-white text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No new updates</div>
            )}
          </div>

          <div className="p-3 bg-gray-50/80 border-t border-gray-100">
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Total Value Card - responsive padding */}
        <div className="md:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-5 md:p-8 border border-white/50 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#81D7B4]/10 rounded-full blur-2xl group-hover:bg-[#81D7B4]/20 transition-all duration-500"></div>

          {/* Card header with token selector */}
          <div className="flex items-center mb-6 md:mb-8">
            <div className="relative">
              <button
                onClick={() =>
                  document.getElementById("chain-dropdown")?.classList.toggle("hidden")
                }
                disabled={isSwitchingChain || isLoading}
                className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2.5 border border-gray-200/50 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="bg-gray-100 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center mr-2 shadow-sm overflow-hidden">
                  <img
                    src={getChainLogo(mounted ? chainId : base.id)}
                    alt={getCurrentChain().name}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain"
                  />
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  {isSwitchingChain ? "Switching..." : getCurrentChain().name}
                </span>
                {isSwitchingChain ? (
                  <div className="animate-spin h-4 w-4 md:h-5 md:w-5 ml-2 border-2 border-gray-300 border-t-[#81D7B4] rounded-full"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5 ml-2 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {/* Dropdown menu */}
              <div
                id="chain-dropdown"
                className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 z-10 hidden"
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={async () => {
                      document.getElementById("chain-dropdown")?.classList.add("hidden");
                      if (!mounted || chain.id === chainId || isSwitchingChain) return;

                      console.log(`Switching to chain: ${chain.name} (${chain.id})`);
                      try {
                        await switchChain({ chainId: chain.id });
                        console.log(`Successfully switched to chain: ${chain.name}`);
                      } catch (error) {
                        console.error(`Failed to switch to chain ${chain.name}:`, error);
                      }
                    }}
                    disabled={isSwitchingChain || chain.id === chainId}
                    className={`flex items-center w-full px-4 py-2 hover:bg-gray-100/80 text-left text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      mounted && chain.id === chainId
                        ? "bg-[#81D7B4]/10 text-[#81D7B4]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center mr-2 overflow-hidden">
                      <img
                        src={getChainLogo(chain.id)}
                        alt={chain.name}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    <div className="flex items-center">
                      {chain.name}
                      {isSwitchingChain && chain.id !== chainId && (
                        <div className="animate-spin h-4 w-4 ml-2 border-2 border-gray-300 border-t-[#81D7B4] rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main value display - responsive text sizes */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-10 md:h-12 bg-gradient-to-b from-[#81D7B4] to-green-400 rounded-full"></div>
            <div className="pl-4">
              <span className="block text-gray-500 text-xs md:text-sm mb-1">Total Value Saved</span>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800 tracking-tight flex items-baseline">
                ${parseFloat(savingsData.totalLocked).toFixed(2)}
                <span className="text-xs md:text-sm font-medium text-gray-500 ml-2">USD</span>
              </h2>
            </div>
          </div>

          {/* Card footer with stats - updated to use real data */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-200/50 flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Total Savings Plan</span>
              <span className="text-base md:text-lg font-semibold text-gray-800">
                {savingsData.deposits}
              </span>
            </div>

            <div className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-200/50 flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Rewards</span>
              <span className="text-base md:text-lg font-semibold text-gray-800">
                {savingsData.rewards} $BTS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Savings Button - responsive padding */}
      <div className="mt-4 md:mt-6 bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.2)] transition-all duration-500 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.04] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-tl from-[#81D7B4]/20 to-blue-300/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/30 transition-all duration-700"></div>
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-gradient-to-br from-purple-300/10 to-transparent rounded-full blur-3xl opacity-70"></div>

        <Link
          href="/dashboard/create-savings"
          className="flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300"
        >
          <div className="bg-gradient-to-br from-[#81D7B4] to-[#81D7B4]/90 rounded-full p-3.5 mr-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_10px_rgba(129,215,180,0.4),0_1px_2px_rgba(0,0,0,0.3)] group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_15px_rgba(129,215,180,0.5),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              className="w-6 h-6 drop-shadow-sm"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">
            Create Savings
          </span>
        </Link>
      </div>

      {/* Savings Plans - responsive spacing */}
      <div className="mt-6 md:mt-8 mb-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4 md:mb-6">
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm ${activeTab === "current" ? "text-[#81D7B4] border-b-2 border-[#81D7B4]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("current")}
          >
            Current
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm ${activeTab === "ready" ? "text-[#81D7B4] border-b-2 border-[#81D7B4]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("ready")}
          >
            Completed
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm ${activeTab === "completed" ? "text-[#81D7B4] border-b-2 border-[#81D7B4]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("completed")}
          >
            Withdrawn
          </button>
        </div>

        {/* Savings plan cards with empty states */}
        {activeTab === "current" && (
          <div className="flex flex-col gap-4 md:gap-6">
            {isLoading ? (
              <Loader />
            ) : savingsData.currentPlans.length > 0 ? (
              <>
                {/* Show only first 3 plans on dashboard */}
                {savingsData.currentPlans.slice(0, 3).map((plan) => (
                  <ActiveSavingPlanCard
                    key={plan.id}
                    plan={plan}
                    openTopUpModal={openTopUpModal}
                    openWithdrawModal={openWithdrawModal}
                  />
                ))}
              </>
            ) : (
              <EmptyCurrentSavings />
            )}
          </div>
        )}

        {activeTab === "ready" && (
          <div className="flex flex-col gap-4 md:gap-6">
            {isLoading ? (
              <Loader />
            ) : savingsData.readyPlans.length > 0 ? (
              <>
                {/* Show only first 3 plans on dashboard */}
                {savingsData.readyPlans.slice(0, 3).map((plan) => (
                  <ActiveSavingPlanCard
                    key={plan.id}
                    plan={plan}
                    openTopUpModal={openTopUpModal}
                    openWithdrawModal={openWithdrawModal}
                  />
                ))}
              </>
            ) : (
              <EmptyReadySavings />
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="flex flex-col gap-4 md:gap-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#81D7B4] rounded-full"></div>
              </div>
            ) : savingsData.completedPlans.length > 0 ? (
              <>
                {/* Show only first 3 completed plans on dashboard */}
                {savingsData.completedPlans.slice(0, 3).map((plan) => (
                  <CompletedSavingPlanCard key={plan.id} plan={plan} />
                ))}
              </>
            ) : (
              <EmptyCompletedSavings />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
