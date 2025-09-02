"use client";

import farcasterMiniApp from "@farcaster/miniapp-wagmi-connector";
import { useConnect, useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function CustomConnectButton() {
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  const router = useRouter();

  function handleOpenApp() {
    if (isConnected) {
      // Open the dashboard
      router.push("/dashboard");
    } else {
      connect({ connector: farcasterMiniApp() });
    }
  }

  return (
    <button
      onClick={handleOpenApp}
      className="group relative px-8 py-4 bg-[#81D7B4] text-white font-semibold rounded-xl hover:bg-[#6bc49f] transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4] to-[#6bc49f] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10 flex items-center gap-2">
        {isConnected ? "Open Dashboard" : "Connect Wallet"}
        <svg
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>
    </button>
  );
}
