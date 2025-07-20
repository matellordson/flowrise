export interface Token {
  symbol: string;
  name: string;
  iconName: string;
  coingeckoId: string; // Added for API calls
  price: number;
  balance: number;
  decimals: number;
  address: string;
}

export const AVAILABLE_TOKENS: Token[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconName: "btc",
    coingeckoId: "bitcoin",
    price: 43250.0,
    balance: 0.05,
    decimals: 8,
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconName: "eth",
    coingeckoId: "ethereum",
    price: 2340.5,
    balance: 1.2345,
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    symbol: "SOL",
    name: "Solana",
    iconName: "sol",
    coingeckoId: "solana",
    price: 98.75,
    balance: 5.0,
    decimals: 9,
    address: "0x570a5d26f7765ecb712c0924e4de545b89fd43df",
  },
  {
    symbol: "BNB",
    name: "BNB",
    iconName: "bnb",
    coingeckoId: "binancecoin",
    price: 315.2,
    balance: 2.5,
    decimals: 18,
    address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    iconName: "usdc",
    coingeckoId: "usd-coin",
    price: 1.0,
    balance: 1000.0,
    decimals: 6,
    address: "0xa0b86a33e6441e6c7d3b4c0b0b0b0b0b0b0b0b0b",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    iconName: "usdt",
    coingeckoId: "tether",
    price: 0.999,
    balance: 500.0,
    decimals: 6,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "XRP",
    name: "XRP",
    iconName: "xrp",
    coingeckoId: "ripple",
    price: 0.52,
    balance: 1000.0,
    decimals: 6,
    address: "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe",
  },
];

export function getTokenBySymbol(symbol: string): Token | undefined {
  return AVAILABLE_TOKENS.find((token) => token.symbol === symbol);
}

export function updateTokenPrice(symbol: string, price: number): void {
  const token = AVAILABLE_TOKENS.find((t) => t.symbol === symbol);
  if (token) {
    token.price = price;
  }
}
