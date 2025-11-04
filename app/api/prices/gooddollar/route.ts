import { NextRequest, NextResponse } from "next/server";

// In-memory cache for GoodDollar price
let goodDollarPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_GOODDOLLAR_PRICE = 0.00009189;

async function fetchGoodDollarPrice(): Promise<number> {
  try {
    console.log("Fetching GoodDollar price from CoinGecko");
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=gooddollar&vs_currencies=usd",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const price = data.gooddollar?.usd;

    return price && price > 0 ? price : DEFAULT_GOODDOLLAR_PRICE;
  } catch (error) {
    console.error("Error fetching GoodDollar price:", error);
    return DEFAULT_GOODDOLLAR_PRICE;
  }
}

export async function GET() {
  try {
    const now = Date.now();

    // Check cache
    if (goodDollarPriceCache && now - goodDollarPriceCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        price: goodDollarPriceCache.price,
        cached: true,
        cache_age_seconds: Math.floor((now - goodDollarPriceCache.timestamp) / 1000),
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch new price
    const price = await fetchGoodDollarPrice();

    // Update cache
    goodDollarPriceCache = { price, timestamp: now };

    return NextResponse.json({
      success: true,
      price,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GoodDollar price API:", error);
    return NextResponse.json(
      {
        success: false,
        price: DEFAULT_GOODDOLLAR_PRICE,
        error: "Failed to fetch price",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
