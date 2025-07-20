import { NextResponse } from "next/server";
import { fetchLivePrices } from "@/lib/tokens";

// ============================================================================
// IMPORT EXTERNAL BALANCE FUNCTIONS
// Assuming these functions are server-side and return the current balance for each coin.
// ============================================================================
import {
  getBtcBal,
  getEthBal,
  getSolBal,
  getBnbBal,
  getUsdcbBal,
  getUsdtbBal,
  getXrpBal,
} from "@/app/dashboard/crypto/coins-bal";

// ============================================================================
// GET COINS WITH LIVE PRICES AND USER BALANCES
// ============================================================================
export async function GET() {
  try {
    // Fetch tokens with live prices from CoinGecko
    const tokensWithLivePrices = await fetchLivePrices();

    // ============================================================================
    // FETCH USER-SPECIFIC BALANCES
    // In a real application, you would fetch these balances based on the authenticated user.
    // For now, we're calling the provided external functions.
    // ============================================================================
    const btcBal = await getBtcBal();
    const ethBal = await getEthBal();
    const solBal = await getSolBal();
    const bnbBal = await getBnbBal();
    const usdcBal = await getUsdcbBal();
    const usdtBal = await getUsdtbBal(); // Corrected import name based on user's provided code
    const xrpBal = await getXrpBal();

    const userBalances: { [key: string]: number } = {
      BTC: btcBal,
      ETH: ethBal,
      SOL: solBal,
      BNB: bnbBal,
      USDC: usdcBal,
      USDT: usdtBal,
      XRP: xrpBal,
    };

    // Combine live prices with user-specific balances
    const coins = tokensWithLivePrices.map((token, index) => ({
      id: index + 1, // Assign a unique ID for client-side keying
      symbol: token.symbol,
      name: token.name,
      coingecko_id: token.coingeckoId,
      icon_name: token.iconName,
      decimals: token.decimals,
      // Use the fetched user balance, or fallback to the default if not found
      balance: userBalances[token.symbol] ?? token.balance,
      price: token.price,
      priceChange24h: token.priceChange24h || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    return NextResponse.json({
      coins: coins,
      timestamp: new Date().toISOString(),
      source: "tokens_with_live_prices_and_user_balances",
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
