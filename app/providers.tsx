'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, celo } from 'wagmi/chains';
import { RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet,
  coinbaseWallet,
  trustWallet,
  rabbyWallet,
  zerionWallet
} from '@rainbow-me/rainbowkit/wallets';
import { useTheme } from 'next-themes';
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";

// Import Rainbow Kit styles
import '@rainbow-me/rainbowkit/styles.css';

// Define the project ID for WalletConnect
const projectId = 'dfffb9bb51c39516580c01f134de2345';

// Define the supported chains - needs to be a tuple type with at least one chain
const chains = [base, celo] as const;

// Create wallet groups with connectorsForWallets - Only supported wallets
const connectors = connectorsForWallets([
    {
      groupName: 'Wallets Supported On Bitsave',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        rabbyWallet,
        trustWallet,
        zerionWallet,
      ],
    },
], {
    appName: 'BitSave',
    projectId,
});

export const config = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
  },
  connectors: [farcasterFrame(), ...connectors],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          modalSize="compact"
          theme={theme === 'dark' ? darkTheme({
            accentColor: '#66C4A3',
            accentColorForeground: 'white',
            borderRadius: 'large',
          }) : lightTheme({
            accentColor: '#81D7B4',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}