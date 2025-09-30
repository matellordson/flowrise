import { NextResponse } from "next/server";

// Mock coin data - in a real app, this would come from a crypto API like CoinGecko
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const COIN_IDS = "bitcoin,ethereum,tether,usd-coin,binancecoin,ripple,solana";

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await fetch(
      `${COINGECKO_API_URL}?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          Accept: "application/json",
        },
        // Cache for 1 minute to avoid hitting rate limits
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const coinsData = await response.json();

    const formattedCoins = coinsData.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));

    return NextResponse.json({
      coins: formattedCoins,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching coins from CoinGecko:", error);

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
        image:
          "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
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
        image:
          "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        current_price: 98.45,
        market_cap: 44000000000,
        market_cap_rank: 5,
        price_change_percentage_24h: 3.21,
      },
    ];

    return NextResponse.json({
      coins: mockCoins,
      timestamp: new Date().toISOString(),
      fallback: true,
    });
  }
}
