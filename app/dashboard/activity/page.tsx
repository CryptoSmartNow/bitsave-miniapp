"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

interface Transaction {
  id: string;
  transaction_type: "deposit" | "withdrawal";
  amount: string;
  currency?: string;
  created_at: string;
  savingsname: string;
  txnhash: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  href: string;
  icon: string;
}

// Mock data for demonstration
const MOCK_USER_DATA = {
  hasSavingsPlan: true,
  hasConnectedX: true,
  hasConnectedFarcaster: true,
  hasEmail: true,
  userPoints: 0,
  referralLink: "https://bitsave.io/ref/123xyz",
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");
  const [selectedActivity, setSelectedActivity] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentUserAddress, setCurrentUserAddress] = useState<string>("");
  const [userData] = useState(MOCK_USER_DATA);

  const { isConnected, address } = useAccount();

  const tasks: Task[] = [
    {
      id: "tweet_after_saving",
      title: "Tweet after Saving",
      description: "Get 1 point for the tweet you send after creating a new savings plan.",
      points: 1,
      isCompleted: false,
      href: "/dashboard/create-savings",
      icon: "tweet",
    },
    {
      id: "connect_x",
      title: "Connect X (Twitter)",
      description: "Link your X account to earn points and unlock social features.",
      points: 1,
      isCompleted: false,
      href: "/dashboard/settings",
      icon: "twitter",
    },
    {
      id: "connect_farcaster",
      title: "Connect Farcaster",
      description: "Link your Farcaster account for onchain perks and rewards.",
      points: 1,
      isCompleted: false,
      href: "/dashboard/settings",
      icon: "farcaster",
    },
    {
      id: "add_email",
      title: "Add Email Address",
      description: "Secure your account and get important notifications.",
      points: 1,
      isCompleted: false,
      href: "/dashboard/settings",
      icon: "email",
    },
    {
      id: "tweet_about_bitsave",
      title: "Tweet about BitSave",
      description: "Share your experience with BitSave on X.",
      points: 5,
      isCompleted: false,
      href: `https://twitter.com/intent/tweet?text=Exploring%20the%20world%20of%20DeFi%20savings%20with%20@bitsaveprotocol!%20%23SaveFi%20%23Web3&url=${userData.referralLink}`,
      icon: "tweet",
    },
    {
      id: "cast_about_bitsave",
      title: "Cast about BitSave",
      description: "Post about BitSave on Farcaster.",
      points: 5,
      isCompleted: false,
      href: `https://warpcast.com/~/compose?text=Exploring%20the%20world%20of%20DeFi%20savings%20with%20@bitsave!%20&embeds[]=${userData.referralLink}`,
      icon: "cast",
    },
    {
      id: "referral_signup",
      title: "Refer a Friend",
      description: "Earn points for every friend who signs up using your link.",
      points: 5,
      isCompleted: false,
      href: "/dashboard/settings",
      icon: "referral",
    },
    {
      id: "complete_plan",
      title: "Complete a Savings Plan",
      description: "Reach your savings goal to earn a streak bonus.",
      points: 10,
      isCompleted: false,
      href: "/dashboard/plans",
      icon: "streak",
    },
    {
      id: "weekly_saving",
      title: "4-Week Saving Streak",
      description: "Save consistently every week for a month.",
      points: 10,
      isCompleted: false,
      href: "/dashboard/plans",
      icon: "calendar",
    },
  ];

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (isConnected) {
        try {
          setCurrentUserAddress(address || "");
        } catch (error) {
          console.error("Error fetching user address:", error);
        }
      }
    };
    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentUserAddress) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/transactions?address=${currentUserAddress}`);
        if (response.ok) {
          const data = (await response.json()) as { transactions: Transaction[] };
          setActivities(data.transactions || []);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [currentUserAddress]);

  const filteredActivities = activities.filter(
    (activity) => filter === "all" || activity.transaction_type === filter,
  );

  const openActivityDetails = (activity: Transaction) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  const getActivityIcon = (type: string) => {
    const iconClass = "w-10 h-10 p-2.5 rounded-xl";

    if (type === "deposit") {
      return (
        <div
          className={`${iconClass} bg-gradient-to-br from-[#81D7B4] to-[#6BC5A0] text-white shadow-lg`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      );
    } else {
      return (
        <div
          className={`${iconClass} bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
          </svg>
        </div>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const TaskIcon = ({ icon }: { icon: string }) => {
    const icons: { [key: string]: ReactNode } = {
      twitter: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      farcaster: (
        <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.5 10.5C21.5 9.67157 20.8284 9 20 9H12C11.1716 9 10.5 9.67157 10.5 10.5V21.5C10.5 22.3284 11.1716 23 12 23H20C20.8284 23 21.5 22.3284 21.5 21.5V10.5Z"
            fill="currentColor"
          />
          <path
            d="M16 13.5C17.3807 13.5 18.5 14.6193 18.5 16C18.5 17.3807 17.3807 18.5 16 18.5C14.6193 18.5 13.5 17.3807 13.5 16C13.5 14.6193 14.6193 13.5 16 13.5Z"
            fill="white"
          />
        </svg>
      ),
      email: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
          />
        </svg>
      ),
      tweet: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      cast: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      referral: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.5a9 9 0 0118 0"
          />
        </svg>
      ),
      streak: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      calendar: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    };
    return icons[icon] || null;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-[#81D7B4]/10 ${inter.className}`}
    >
      {/* Enhanced Background Elements with Neomorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with glassmorphism */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-[#81D7B4]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-[#81D7B4]/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-400/8 to-pink-400/8 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url('/noise.jpg')`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Earn More Points Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20"
        >
          {/* Neomorphic container with enhanced glassmorphism */}
          <div className="relative bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden">
            {/* Enhanced background patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#81D7B4]/3 via-blue-500/3 to-purple-500/3"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#81D7B4]/8 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-blue-400/6 to-transparent rounded-full blur-2xl"></div>

            {/* Inner shadow for neomorphism */}
            <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] bg-gradient-to-br from-white/20 to-white/5 pointer-events-none"></div>

            <div className="relative p-8 lg:p-16">
              <div className="text-center mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-6 tracking-tight"
                >
                  Earn More Points
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-xl text-gray-600/80 max-w-3xl mx-auto leading-relaxed"
                >
                  Complete these tasks to earn points and unlock exclusive rewards in the BitSave
                  ecosystem
                </motion.p>
              </div>

              {/* Enhanced Tasks Grid with Neomorphism */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 * index,
                      ease: "easeOut",
                    }}
                    className="group"
                  >
                    <Link
                      href={task.href || "#"}
                      target={task.href?.startsWith("http") ? "_blank" : "_self"}
                    >
                      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg hover:shadow-2xl p-6 h-full transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#81D7B4]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>

                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="bg-gradient-to-br from-[#81D7B4] to-[#6BC5A0] rounded-xl p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <TaskIcon icon={task.icon} />
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                task.isCompleted
                                  ? "text-[#4A9B7A] bg-[#81D7B4]/20 border border-[#81D7B4]/30"
                                  : "text-gray-400 bg-gray-100/80"
                              }`}
                            >
                              {task.isCompleted ? "Completed" : "To Do"}
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-gray-900 transition-colors">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {task.description}
                          </p>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                            <span className="text-sm font-bold bg-gradient-to-r from-[#81D7B4] to-[#6BC5A0] bg-clip-text text-transparent">
                              +{task.points} {task.points > 1 ? "Points" : "Point"}
                            </span>
                            <div className="text-gray-400 group-hover:text-[#81D7B4] transition-colors duration-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/dashboard/social"
                  className="inline-flex items-center bg-gradient-to-r from-[#81D7B4] to-[#6BC5A0] text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:from-[#6BC5A0] hover:to-[#5AB08A] transition-all duration-300 text-lg group"
                >
                  View All Tasks
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Activity History
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Track all your deposits, withdrawals, and rewards across your savings plans.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg">
              {[
                { key: "all", label: "All Activities" },
                { key: "deposit", label: "Deposits" },
                { key: "withdrawal", label: "Withdrawals" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as "all" | "deposit" | "withdrawal")}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    filter === tab.key
                      ? "bg-gradient-to-r from-[#81D7B4] to-[#6BC5A0] text-white shadow-lg shadow-[#81D7B4]/25"
                      : "text-gray-600 hover:bg-white/70 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
            {/* Activity List Header */}
            <div className="bg-white/90 backdrop-blur-sm p-6 border-b border-gray-200/50 hidden lg:grid lg:grid-cols-5 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-2">Transaction</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>

            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center p-4 bg-gray-50/50 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-xl mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                    <div className="w-24 h-6 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-100/80 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No activities found</h3>
                <p className="text-gray-600">
                  There are no {filter !== "all" ? filter : ""} activities to display.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50">
                {filteredActivities.map((activity, index) => {
                  const formattedDate = formatDate(activity.created_at);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6 hover:bg-white/60 transition-all duration-300 cursor-pointer group"
                      onClick={() => openActivityDetails(activity)}
                    >
                      <div className="lg:grid lg:grid-cols-5 flex flex-col space-y-3 lg:space-y-0 items-start lg:items-center">
                        {/* Transaction */}
                        <div className="col-span-2 flex items-center">
                          <div className="group-hover:scale-110 transition-transform duration-300">
                            {getActivityIcon(activity.transaction_type)}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-800 capitalize text-lg">
                              {activity.transaction_type}
                            </p>
                            <p className="text-sm text-gray-500">{activity.savingsname}</p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="text-sm text-gray-600 lg:ml-0 ml-14">
                          <p className="font-medium">{formattedDate.date}</p>
                          <p className="text-xs text-gray-500">{formattedDate.time}</p>
                        </div>

                        {/* Amount */}
                        <div
                          className={`font-bold text-lg lg:ml-0 ml-14 ${
                            activity.transaction_type === "deposit"
                              ? "text-emerald-600"
                              : "text-orange-500"
                          }`}
                        >
                          {activity.transaction_type === "deposit" ? "+" : "-"}
                          {activity.amount} {activity.currency || "ETH"}
                        </div>

                        {/* Status */}
                        <div className="lg:ml-0 ml-14">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                            Completed
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsDetailsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl"
            >
              {selectedActivity && (
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">
                  {/* Background Elements */}
                  <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
                  <div className="absolute -left-20 -top-20 w-60 h-60 bg-gradient-to-tr from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>

                  {/* Header */}
                  <div className="relative p-8 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getActivityIcon(selectedActivity.transaction_type)}
                        <div className="ml-4">
                          <h3 className="text-2xl font-bold text-gray-800 capitalize">
                            {selectedActivity.transaction_type}
                          </h3>
                          <p className="text-gray-500">
                            {formatDate(selectedActivity.created_at).date} at{" "}
                            {formatDate(selectedActivity.created_at).time}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsDetailsOpen(false)}
                        className="bg-gray-100/80 backdrop-blur-sm rounded-2xl p-3 hover:bg-gray-200/80 transition-all duration-300 group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-600 group-hover:text-gray-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Amount</p>
                        <p
                          className={`text-2xl font-bold ${
                            selectedActivity.transaction_type === "deposit"
                              ? "text-emerald-600"
                              : "text-orange-500"
                          }`}
                        >
                          {selectedActivity.transaction_type === "deposit" ? "+" : "-"}
                          {selectedActivity.amount} {selectedActivity.currency || "ETH"}
                        </p>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Status</p>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mr-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                            Completed
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5 text-emerald-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Plan</p>
                        <p className="font-semibold text-gray-800 text-lg">
                          {selectedActivity.savingsname}
                        </p>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                        <p className="text-sm text-gray-500 mb-2 font-medium">Network</p>
                        <div className="flex items-center">
                          <Image
                            src="/base.svg"
                            alt="Base"
                            width={20}
                            height={20}
                            className="w-5 h-5 mr-3"
                          />
                          <span className="font-semibold text-gray-800">Base</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
                      <p className="text-sm text-gray-500 mb-3 font-medium">Transaction Hash</p>
                      <div className="flex items-center justify-between">
                        <code className="bg-white px-4 py-2 rounded-xl text-sm font-mono text-gray-800 overflow-x-auto max-w-[300px] border">
                          {selectedActivity.txnhash}
                        </code>
                        <a
                          href={`https://basescan.org/tx/${selectedActivity.txnhash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 text-sm flex items-center font-medium ml-4 hover:underline transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          View on Explorer
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-8 border-t border-gray-200/50 flex justify-end">
                    <button
                      onClick={() => setIsDetailsOpen(false)}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
