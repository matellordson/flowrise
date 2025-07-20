import { NextResponse } from "next/server";
import { AVAILABLE_TOKENS } from "@/lib/tokens";

// ============================================================================
// GET COINS WITH LIVE PRICES - Returns coins with icon component mapping
// ============================================================================
export async function GET() {
  try {
    // Convert tokens to coins format with icon mapping
    const coins = AVAILABLE_TOKENS.map((token, index) => ({
      id: index + 1,
      symbol: token.symbol,
      name: token.name,
      coingecko_id: token.coingeckoId,
      icon_name: token.iconName,
      decimals: token.decimals,
      balance: token.balance,
      price: token.price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // ============================================================================
    // UPDATE PRICES FROM COINGECKO (Optional - can be separate cron job)
    // ============================================================================
    const coingeckoIds = coins.map((coin) => coin.coingecko_id).join(",");

    try {
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=usd`,
        { next: { revalidate: 60 } }, // Cache for 1 minute
      );

      if (priceResponse.ok) {
        const priceData = await priceResponse.json();

        // Update prices in response
        for (const coin of coins) {
          const newPrice = priceData[coin.coingecko_id]?.usd;
          if (newPrice) {
            coin.price = newPrice;
          }
        }
      }
    } catch (priceError) {
      console.warn("Failed to update prices from CoinGecko:", priceError);
      // Continue with cached prices
    }

    return NextResponse.json({
      coins: coins,
      timestamp: new Date().toISOString(),
      source: "tokens_with_live_prices",
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
