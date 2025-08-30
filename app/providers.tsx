"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, celo } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { MiniAppProvider } from "@neynar/react";

// Define the supported chains - needs to be a tuple type with at least one chain
const chains = [base, celo] as const;

export const config = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
  },
  connectors: [farcasterFrame()],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniAppProvider analyticsEnabled={true}>{children}</MiniAppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
