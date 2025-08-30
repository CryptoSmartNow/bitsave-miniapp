import { useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { trackWalletDisconnect } from "./interactionTracker";

/**
 * Optimized disconnect hook that provides immediate UI feedback
 * and faster disconnection experience
 */
export function useOptimizedDisconnect() {
  const router = useRouter();
  const { address } = useAccount();

  const { disconnect: wagmiDisconnect, isPending } = useDisconnect({
    mutation: {
      onSuccess: () => {
        // Immediate redirect on successful disconnect
        router.push("/");
      },
      onError: (error) => {
        console.error("Disconnect error:", error);
        // Still redirect even on error to prevent stuck state
        router.push("/");
      },
    },
  });

  const optimizedDisconnect = useCallback(() => {
    // Track wallet disconnection before disconnecting
    if (address) {
      trackWalletDisconnect(address);
    }

    // Immediate UI feedback - start disconnect process
    wagmiDisconnect();
  }, [wagmiDisconnect, address]);

  return {
    disconnect: optimizedDisconnect,
    isDisconnecting: isPending,
  };
}
