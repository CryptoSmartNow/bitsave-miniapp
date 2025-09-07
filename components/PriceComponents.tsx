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

async function fetchPrice(id: string, fallback: number): Promise<number> {
  try {
    console.log(`Fetching price for ${id} from CoinGecko`);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
    );
    const data = await res.json();
    const price = data[id]?.usd;
    return price && price > 0 ? price : fallback;
  } catch {
    return fallback;
  }
}

export function PriceProvider({ children }: { children: ReactNode }) {
  const { data: ethPrice } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: () => fetchPrice("ethereum", 4000),
    refetchInterval: 300_000,
  });

  const { data: celoPrice } = useQuery({
    queryKey: ["celoPrice"],
    queryFn: () => fetchPrice("celo", 0.3),
    refetchInterval: 300_000,
  });

  const { data: goodDollarPrice } = useQuery({
    queryKey: ["goodDollarPrice"],
    queryFn: () => fetchPrice("gooddollar", 0.00009189),
    refetchInterval: 300_000,
  });

  return (
    <PriceContext.Provider
      value={{
        ethPrice: ethPrice ?? 0,
        celoPrice: celoPrice ?? 0,
        goodDollarPrice: goodDollarPrice ?? 0,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}
