import { NextRequest, NextResponse } from "next/server";

// In-memory cache for ETH price
let ethPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_ETH_PRICE = 4000;

async function fetchEthPrice(): Promise<number> {
  try {
    console.log('Fetching ETH price from CoinGecko');
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    
    const data = await res.json();
    const price = data.ethereum?.usd;
    
    return price && price > 0 ? price : DEFAULT_ETH_PRICE;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return DEFAULT_ETH_PRICE;
  }
}

export async function GET() {
  try {
    const now = Date.now();
    
    // Check cache
    if (ethPriceCache && (now - ethPriceCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        price: ethPriceCache.price,
        cached: true,
        cache_age_seconds: Math.floor((now - ethPriceCache.timestamp) / 1000),
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch new price
    const price = await fetchEthPrice();
    
    // Update cache
    ethPriceCache = { price, timestamp: now };

    return NextResponse.json({
      success: true,
      price,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in ETH price API:', error);
    return NextResponse.json({
      success: false,
      price: DEFAULT_ETH_PRICE,
      error: 'Failed to fetch price',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
