import { NextRequest, NextResponse } from "next/server";

// In-memory cache for CELO price
let celoPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CELO_PRICE = 0.3;

async function fetchCeloPrice(): Promise<number> {
  try {
    console.log("Fetching CELO price from CoinGecko");
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const price = data.celo?.usd;

    return price && price > 0 ? price : DEFAULT_CELO_PRICE;
  } catch (error) {
    console.error("Error fetching CELO price:", error);
    return DEFAULT_CELO_PRICE;
  }
}

export async function GET() {
  try {
    const now = Date.now();

    // Check cache
    if (celoPriceCache && now - celoPriceCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        price: celoPriceCache.price,
        cached: true,
        cache_age_seconds: Math.floor((now - celoPriceCache.timestamp) / 1000),
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch new price
    const price = await fetchCeloPrice();

    // Update cache
    celoPriceCache = { price, timestamp: now };

    return NextResponse.json({
      success: true,
      price,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in CELO price API:", error);
    return NextResponse.json(
      {
        success: false,
        price: DEFAULT_CELO_PRICE,
        error: "Failed to fetch price",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
