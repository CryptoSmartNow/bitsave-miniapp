import { NextRequest, NextResponse } from "next/server";

// In-memory cache for prices with timestamps
const priceCache = new Map<string, { price: number; timestamp: number }>();

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Default fallback prices
const DEFAULT_PRICES = {
  ethereum: 4000,
  celo: 0.3,
  gooddollar: 0.00009189,
};

type TokenId = keyof typeof DEFAULT_PRICES;

async function fetchPriceFromCoinGecko(id: string, fallback: number): Promise<number> {
  try {
    console.log(`Fetching price for ${id} from CoinGecko`);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!res.ok) {
      throw new Error(`CoinGecko API error: ${res.status}`);
    }

    const data = await res.json();
    const price = data[id]?.usd;
    
    if (price && price > 0) {
      console.log(`Successfully fetched ${id} price: $${price}`);
      return price;
    } else {
      console.warn(`Invalid price data for ${id}, using fallback: $${fallback}`);
      return fallback;
    }
  } catch (error) {
    console.error(`Error fetching price for ${id}:`, error);
    return fallback;
  }
}

async function getCachedPrice(tokenId: TokenId): Promise<number> {
  const cached = priceCache.get(tokenId);
  const now = Date.now();
  
  // Check if we have cached data and it's less than 5 minutes old
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`Using cached price for ${tokenId}: $${cached.price}`);
    return cached.price;
  }

  // Fetch new price
  const fallback = DEFAULT_PRICES[tokenId];
  const newPrice = await fetchPriceFromCoinGecko(tokenId, fallback);
  
  // Update cache
  priceCache.set(tokenId, {
    price: newPrice,
    timestamp: now,
  });

  return newPrice;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokens = searchParams.get('tokens');

    console.log('Price API called with tokens:', tokens);

    if (!tokens) {
      return NextResponse.json(
        { error: 'Missing tokens parameter. Use ?tokens=ethereum,celo,gooddollar' },
        { status: 400 }
      );
    }

    const tokenIds = tokens.split(',').map(token => token.trim()) as TokenId[];
    
    // Validate token IDs
    const validTokens = tokenIds.filter(token => token in DEFAULT_PRICES);
    if (validTokens.length === 0) {
      return NextResponse.json(
        { error: 'No valid tokens provided. Supported tokens: ethereum, celo, gooddollar' },
        { status: 400 }
      );
    }

    console.log('Valid tokens to fetch:', validTokens);

    // Fetch prices for all requested tokens in parallel
    const pricePromises = validTokens.map(async (tokenId) => {
      const price = await getCachedPrice(tokenId);
      return { [tokenId]: price };
    });

    const priceResults = await Promise.all(pricePromises);
    const prices = Object.assign({}, ...priceResults);

    console.log('Fetched prices:', prices);

    // Add cache info
    const cacheInfo = Object.fromEntries(
      validTokens.map(token => {
        const cached = priceCache.get(token);
        return [
          `${token}_cache_age`,
          cached ? Math.floor((Date.now() - cached.timestamp) / 1000) : 0
        ];
      })
    );

    return NextResponse.json(
      {
        success: true,
        prices,
        cache_info: cacheInfo,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes client cache
        },
      }
    );
  } catch (error) {
    console.error('Error in prices API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        success: false,
        prices: DEFAULT_PRICES, // Return defaults on error
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
