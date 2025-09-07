// PriceContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

type PriceContextType = {
  ethPrice: number;
  celoPrice: number;
  goodDollarPrice: number;
};

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export function usePrices() {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error("usePrices must be used within PriceProvider");
  return ctx;
}

// Function to fetch prices from our API
async function fetchPricesFromAPI(): Promise<{ ethPrice: number; celoPrice: number; goodDollarPrice: number }> {
  try {
    console.log('Fetching prices from internal API');
    const res = await fetch('/api/prices?tokens=ethereum,celo,gooddollar', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && data.prices) {
      return {
        ethPrice: data.prices.ethereum || 4000,
        celoPrice: data.prices.celo || 0.3,
        goodDollarPrice: data.prices.gooddollar || 0.00009189,
      };
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('Error fetching prices from API:', error);
    // Return fallback prices
    return {
      ethPrice: 4000,
      celoPrice: 0.3,
      goodDollarPrice: 0.00009189,
    };
  }
}

// Individual price fetchers for fallback
async function fetchIndividualPrice(endpoint: string, fallback: number): Promise<number> {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    return data.success ? data.price : fallback;
  } catch {
    return fallback;
  }
}

export function PriceProvider({ children }: { children: ReactNode }) {
  // Primary query: fetch all prices from our bulk API
  const { data: allPrices, isLoading, error } = useQuery({
    queryKey: ["allPrices"],
    queryFn: fetchPricesFromAPI,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
    retry: 2,
  });

  // Fallback queries for individual prices (only used if bulk API fails)
  const { data: ethPrice } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: () => fetchIndividualPrice("/api/prices/eth", 4000),
    enabled: !allPrices && !!error, // Only run if bulk API failed
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: celoPrice } = useQuery({
    queryKey: ["celoPrice"],
    queryFn: () => fetchIndividualPrice("/api/prices/celo", 0.3),
    enabled: !allPrices && !!error,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: goodDollarPrice } = useQuery({
    queryKey: ["goodDollarPrice"],
    queryFn: () => fetchIndividualPrice("/api/prices/gooddollar", 0.00009189),
    enabled: !allPrices && !!error,
    refetchInterval: 5 * 60 * 1000,
  });

  // Use bulk prices if available, otherwise fallback to individual prices or defaults
  const finalPrices = {
    ethPrice: allPrices?.ethPrice ?? ethPrice ?? 4000,
    celoPrice: allPrices?.celoPrice ?? celoPrice ?? 0.3,
    goodDollarPrice: allPrices?.goodDollarPrice ?? goodDollarPrice ?? 0.00009189,
  };

  return (
    <PriceContext.Provider value={finalPrices}>
      {children}
    </PriceContext.Provider>
  );
}
