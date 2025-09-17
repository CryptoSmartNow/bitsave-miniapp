"use client";

import { useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface ShareMiniAppProps {
  variant?: "primary" | "secondary" | "minimal" | "icon";
  size?: "sm" | "md" | "lg";
  customText?: string;
  customMessage?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function ShareMiniApp({
  variant = "secondary",
  size = "md",
  customText,
  customMessage,
  className = "",
  onSuccess,
  onError,
}: ShareMiniAppProps) {
  const [isSharing, setIsSharing] = useState(false);

  const defaultMessages = {
    hero: "Just discovered BitSave - the smartest way to save crypto without losing to market volatility! Check it out 👇",
    dashboard: "Been using BitSave to grow my crypto savings safely! I don't worry about market dips anymore 📈",
    success: "Just completed another savings milestone with BitSave! Building wealth in crypto has never been this secure 💪",
    default: "Building my crypto wealth with BitSave - smart savings that protect against volatility while earning yield! 🔥",
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      const message = customMessage || defaultMessages.default;
      const currentUrl = window.location.origin;
      
      await sdk.actions.composeCast({
        text: message,
        embeds: [currentUrl],
      });
      
      onSuccess?.();
    } catch (error) {
      console.error("Failed to share miniapp:", error);
      onError?.(error);
    } finally {
      setIsSharing(false);
    }
  };

  const getButtonText = () => {
    if (customText) return customText;
    if (isSharing) return "Sharing...";
    
    switch (variant) {
      case "minimal":
        return "Share";
      case "icon":
        return "";
      default:
        return "Share BitSave";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-[#81D7B4] text-white hover:bg-[#6bc49f] shadow-lg hover:shadow-xl";
      case "minimal":
        return "bg-transparent text-[#81D7B4] hover:bg-[#81D7B4]/10 border border-[#81D7B4]";
      case "icon":
        return "bg-[#81D7B4]/10 text-[#81D7B4] hover:bg-[#81D7B4]/20 p-3 rounded-full";
      default:
        return "bg-white text-[#81D7B4] hover:bg-gray-50 border border-gray-200 hover:border-[#81D7B4]";
    }
  };

  const ShareIcon = () => (
    <svg
      className={variant === "icon" ? "w-5 h-5" : "w-4 h-4"}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`group relative inline-flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${getVariantClasses()} ${className}`}
        title="Share BitSave on Farcaster"
      >
        {isSharing ? (
          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
        ) : (
          <>
            <ShareIcon />
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`group relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${getSizeClasses()} ${getVariantClasses()} ${className}`}
    >
      {isSharing ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
      ) : (
        <>
          <ShareIcon />
        </>
      )}
      <span>{getButtonText()}</span>
    </button>
  );
}