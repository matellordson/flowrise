export interface Token {
  symbol: string;
  name: string;
  iconName: string;
  coingeckoId: string; // Added for API calls
  price: number;
  balance: number;
  decimals: number;
  address: string;
  priceChange24h?: number; // Add 24h price change
}

export const AVAILABLE_TOKENS: Token[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconName: "btc",
    coingeckoId: "bitcoin",
    price: 43250.0, // Default price, will be updated by live fetch
    balance: 0.05, // Default balance, in a real app this would be user-specific
    decimals: 8,
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconName: "eth",
    coingeckoId: "ethereum",
    price: 2340.5, // Default price
    balance: 1.2345, // Default balance
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    symbol: "SOL",
    name: "Solana",
    iconName: "sol",
    coingeckoId: "solana",
    price: 98.75, // Default price
    balance: 5.0, // Default balance
    decimals: 9,
    address: "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
  },
  {
    symbol: "BNB",
    name: "BNB",
    iconName: "bnb",
    coingeckoId: "binancecoin",
    price: 315.2, // Default price
    balance: 2.5, // Default balance
    decimals: 18,
    address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    iconName: "usdc",
    coingeckoId: "usd-coin",
    price: 1.0, // Default price
    balance: 1000.0, // Default balance
    decimals: 6,
    address: "0xa0b86a33e6441e6c7d3b4c0b0b0b0b0b0b0b0b0b",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    iconName: "usdt",
    coingeckoId: "tether",
    price: 0.999, // Default price
    balance: 500.0, // Default balance
    decimals: 6,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "XRP",
    name: "XRP",
    iconName: "xrp",
    coingeckoId: "ripple",
    price: 0.52, // Default price
    balance: 1000.0, // Default balance
    decimals: 6,
    address: "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe",
  },
];

// Cache for live prices
let cachedTokens: Token[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1-minute cache

export async function fetchLivePrices(): Promise<Token[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedTokens && now - lastFetchTime < CACHE_TTL) {
    return cachedTokens;
  }

  try {
    // Get all CoinGecko IDs
    const coingeckoIds = AVAILABLE_TOKENS.map(
      (token) => token.coingeckoId,
    ).join(",");

    // Fetch prices from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: "application/json",
        },
        // Cache for 30 seconds to avoid rate limiting
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const priceData = await response.json();

    // Update token prices
    const updatedTokens = AVAILABLE_TOKENS.map((token) => {
      const coinData = priceData[token.coingeckoId];
      if (coinData) {
        return {
          ...token,
          price: coinData.usd,
          priceChange24h: coinData.usd_24h_change || 0,
        };
      }
      return token;
    });

    cachedTokens = updatedTokens;
    lastFetchTime = Date.now();

    return updatedTokens;
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
    // Return cached data or fallback to default prices
    return cachedTokens ?? AVAILABLE_TOKENS;
  }
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  // When fetching by symbol, we should ideally use the live cached data
  // if available, otherwise fallback to the static list.
  const sourceTokens = cachedTokens || AVAILABLE_TOKENS;
  return sourceTokens.find((token) => token.symbol === symbol);
}

export function updateTokenPrice(symbol: string, price: number): void {
  // This function is primarily for internal updates if needed,
  // but the main price updates come from fetchLivePrices.
  const token = AVAILABLE_TOKENS.find((t) => t.symbol === symbol);
  if (token) {
    token.price = price;
  }

  // Also update cached tokens if they exist
  if (cachedTokens) {
    const cachedToken = cachedTokens.find((t) => t.symbol === symbol);
    if (cachedToken) {
      cachedToken.price = price;
    }
  }
}

export function getTokensWithLivePrices(): Promise<Token[]> {
  return fetchLivePrices();
}
