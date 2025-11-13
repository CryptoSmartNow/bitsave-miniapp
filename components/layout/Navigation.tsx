"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CustomConnectButton from "@/components/CustomConnectButton";
import sdk from "@farcaster/miniapp-sdk";

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { isConnected, isDisconnected } = useAccount();
  const { disconnect, isPending: isDisconnecting } = useDisconnect();
  const pathname = usePathname();

  console.log("isConnected:", isConnected);
  console.log("isDisconnected:", isDisconnected);

  useEffect(() => {
    // Always start with sidebar collapsed on mobile
    setSidebarCollapsed(true);
    sdk.actions.ready();
    console.log("Mini App is ready");
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && (pathname === "/dashboard" || pathname === "/")) {
      return true;
    }
    return path !== "/dashboard" && pathname.startsWith(path);
  };

  return (
    <div className="font-sans min-h-screen bg-[#f2f2f2] text-gray-800 overflow-x-hidden relative">
      {/* Mobile Header with Toggle */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-[#81D7B4]/10 rounded-lg hover:bg-[#81D7B4]/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6 text-[#81D7B4]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-xl font-bold text-gray-800">BitSave</span>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Sidebar - mobile focused */}
      <div
        className={`fixed h-full bg-white shadow-xl transition-transform duration-300 z-50 w-64 ${
          sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200/30">
          <span className="text-2xl font-bold text-gray-800">BitSave</span>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar content with modern icons */}
        <div className="py-6">
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 22V12h6v10"
              />
            </svg>
            <span className="ml-3">Dashboard</span>
          </Link>

          <Link
            href="/dashboard/plans"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/plans")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-3">My Plans</span>
          </Link>

          <Link
            href="/dashboard/activity"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/activity")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="ml-3">Activity</span>
          </Link>

          <Link
            href="/dashboard/social"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/social")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-[#81D7B4]/80 transition-colors"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
              <ellipse cx="12" cy="12" rx="8" ry="2" strokeWidth="1.5" opacity="0.7" />
              <ellipse cx="12" cy="12" rx="6.5" ry="1.5" strokeWidth="1" opacity="0.5" />
            </svg>
            <span className="ml-3">Savvy Space</span>
          </Link>

          <Link
            href="/dashboard/leaderboard"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/leaderboard")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
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
                d="M16 8v8m-8-5v5M4 9h16M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="ml-3">Leaderboard</span>
          </Link>

          <Link
            href="/dashboard/referrals"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/referrals")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="ml-3">Referrals</span>
          </Link>

          <Link
            href="/dashboard/create-savings"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/create-savings")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="ml-3">Create Plan</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center px-4 py-3 mb-2 rounded-lg mx-2 ${
              isActive("/dashboard/settings")
                ? "bg-[#81D7B4]/20 text-[#81D7B4]"
                : "hover:bg-gray-100/60 text-gray-600 hover:text-gray-800 transition-colors"
            }`}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="ml-3">Settings</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/30">
          <button
            onClick={() => {
              disconnect();
            }}
            disabled={isDisconnecting}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100/60 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDisconnecting ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
            <span className="ml-3">{isDisconnecting ? "Disconnecting..." : "Disconnect"}</span>
          </button>

          <div className="mt-3 text-center">
            <span className="text-xs text-gray-400 font-medium">Version V1.1.0</span>
          </div>
        </div>
      </div>

      {/* Main Content with top padding for header */}
      <div className="pt-20 min-h-screen">
        {isConnected ? (
          <div className="p-4">{children}</div>
        ) : (
          <div className="p-4">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-8 w-full">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#81D7B4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
                <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
                  Connect your wallet to access BitSave and start building your savings on-chain.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CustomConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
