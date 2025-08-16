import { NextResponse } from "next/server";

// Mock coin data - in a real app, this would come from a crypto API like CoinGecko
const mockCoins = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 43250.5,
    market_cap: 847000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.45,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2650.75,
    market_cap: 318000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.23,
  },
  {
    id: "tether",
    symbol: "USDT",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0,
    market_cap: 95000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.01,
  },
  {
    id: "usd-coin",
    symbol: "USDC",
    name: "USD Coin",
    image:
      "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    current_price: 1.0,
    market_cap: 28000000000,
    market_cap_rank: 6,
    price_change_percentage_24h: -0.02,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    image:
      "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 315.2,
    market_cap: 47000000000,
    market_cap_rank: 4,
    price_change_percentage_24h: 1.87,
  },
  {
    id: "ripple",
    symbol: "XRP",
    name: "XRP",
    image:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.62,
    market_cap: 34000000000,
    market_cap_rank: 7,
    price_change_percentage_24h: 4.15,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 98.45,
    market_cap: 44000000000,
    market_cap_rank: 5,
    price_change_percentage_24h: 3.21,
  },
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      coins: mockCoins,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching coins:", error);
    return NextResponse.json(
      { error: "Failed to fetch coins" },
      { status: 500 },
    );
  }
}
