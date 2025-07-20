import { NextResponse } from "next/server";

// ============================================================================
// DATABASE CONFIGURATION - Replace with your actual database setup
// ============================================================================

// Mock database interface - REPLACE WITH YOUR ACTUAL DATABASE
interface DatabaseCoin {
  id: number;
  symbol: string;
  name: string;
  coingecko_id: string;
  icon_component: string; // Maps to the icon component name
  decimals: number;
  balance: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// GET COINS WITH LIVE PRICES - Returns coins with icon component mapping
// ============================================================================
export async function GET() {
  try {
    // ============================================================================
    // STEP 1: FETCH COINS FROM YOUR DATABASE
    // Replace this with your actual database query
    // ============================================================================

    // Example SQL query (customize for your database):
    // const coins = await db.query(`
    //   SELECT id, symbol, name, coingecko_id, icon_component, decimals, balance, price, updated_at
    //   FROM coins
    //   WHERE active = true
    //   ORDER BY symbol ASC
    // `)

    // Mock data - REPLACE WITH YOUR DATABASE QUERY
    const coins: DatabaseCoin[] = [
      {
        id: 1,
        symbol: "BTC",
        name: "Bitcoin",
        coingecko_id: "bitcoin",
        icon_component: "Bitcoin", // Maps to imported Bitcoin component
        decimals: 8,
        balance: 0.05,
        price: 43250.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        symbol: "ETH",
        name: "Ethereum",
        coingecko_id: "ethereum",
        icon_component: "Ethereum", // Maps to imported Ethereum component
        decimals: 18,
        balance: 1.2345,
        price: 2340.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        symbol: "SOL",
        name: "Solana",
        coingecko_id: "solana",
        icon_component: "Solana", // Maps to imported Solana component
        decimals: 9,
        balance: 5.0,
        price: 98.75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        symbol: "BNB",
        name: "BNB",
        coingecko_id: "binancecoin",
        icon_component: "BinanceCoin", // Maps to imported BinanceCoin component
        decimals: 18,
        balance: 2.5,
        price: 315.2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        symbol: "USDC",
        name: "USD Coin",
        coingecko_id: "usd-coin",
        icon_component: "UsdCoin", // Maps to imported UsdCoin component
        decimals: 6,
        balance: 1000.0,
        price: 1.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        symbol: "USDT",
        name: "Tether USD",
        coingecko_id: "tether",
        icon_component: "Tether", // Maps to imported Tether component
        decimals: 6,
        balance: 500.0,
        price: 0.999,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        symbol: "XRP",
        name: "XRP",
        coingecko_id: "ripple",
        icon_component: "Ripple", // Maps to imported Ripple component
        decimals: 6,
        balance: 1000.0,
        price: 0.52,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // ============================================================================
    // STEP 2: UPDATE PRICES FROM COINGECKO (Optional - can be separate cron job)
    // ============================================================================

    const coingeckoIds = coins.map((coin) => coin.coingecko_id).join(",");

    try {
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd`,
        { next: { revalidate: 60 } }, // Cache for 1 minute
      );

      if (priceResponse.ok) {
        const priceData = await priceResponse.json();

        // Update prices in database and response
        for (const coin of coins) {
          const newPrice = priceData[coin.coingecko_id]?.usd;
          if (newPrice) {
            coin.price = newPrice;

            // Update price in database
            // await db.query(`
            //   UPDATE coins
            //   SET price = $1, updated_at = NOW()
            //   WHERE id = $2
            // `, [newPrice, coin.id])
          }
        }
      }
    } catch (priceError) {
      console.warn("Failed to update prices from CoinGecko:", priceError);
      // Continue with cached prices from database
    }

    // ============================================================================
    // STEP 3: RETURN COINS WITH ICON COMPONENT MAPPING
    // ============================================================================

    return NextResponse.json({
      coins: coins,
      timestamp: new Date().toISOString(),
      source: "database_with_live_prices",
    });
  } catch (error) {
    console.error("Coins API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch coins",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
