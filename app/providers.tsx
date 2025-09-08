"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, webSocket } from "wagmi";
import { base, celo } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { MiniAppProvider } from "@neynar/react";
import { PriceProvider } from "@/components/PriceComponents";

// Define the supported chains - needs to be a tuple type with at least one chain
const chains = [base, celo] as const;

export const config = createConfig({
  chains,
  transports: {
    [base.id]: webSocket("wss://base.gateway.tenderly.co"),
    [celo.id]: webSocket("wss://celo.drpc.org"),
  },
  connectors: [farcasterFrame()],
});

config.connectors.forEach((connector) => {
  if (!connector.getChainId) {
    console.log("Patching connector to add getChainId method");
    connector.getChainId = async () => {
      return config.state.chainId;
    };
  }
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniAppProvider analyticsEnabled={true}>
          <PriceProvider>{children}</PriceProvider>
        </MiniAppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
