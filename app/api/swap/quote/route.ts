import { type NextRequest, NextResponse } from "next/server";
import { AVAILABLE_TOKENS } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const { from_coin_id, to_coin_id, amount } = await request.json();

    // Validate input
    if (!from_coin_id || !to_coin_id || !amount) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: from_coin_id, to_coin_id, amount",
        },
        { status: 400 },
      );
    }

    const fromAmount = Number.parseFloat(amount);
    if (fromAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    // Get coins by ID (convert ID to array index)
    const fromCoin = AVAILABLE_TOKENS[from_coin_id - 1];
    const toCoin = AVAILABLE_TOKENS[to_coin_id - 1];

    if (!fromCoin || !toCoin) {
      return NextResponse.json({ error: "Invalid coin ID" }, { status: 400 });
    }

    // Check sufficient balance
    if (fromAmount > fromCoin.balance) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 },
      );
    }

    // ============================================================================
    // CALCULATE EXCHANGE RATE AND FEES
    // ============================================================================
    const baseRate = fromCoin.price / toCoin.price;
    const spreadPercentage = 0.3; // 0.3% spread
    const exchangeRate = baseRate * (1 - spreadPercentage / 100);
    const toAmount = fromAmount * exchangeRate;

    // ============================================================================
    // CALCULATE PRICE IMPACT
    // ============================================================================
    const tradeValue = fromAmount * fromCoin.price;
    let priceImpact = 0;

    if (tradeValue > 50000) {
      priceImpact = 2.0 + Math.random() * 1.5; // 2-3.5% for large trades
    } else if (tradeValue > 10000) {
      priceImpact = 0.5 + Math.random() * 1.0; // 0.5-1.5% for medium trades
    } else {
      priceImpact = Math.random() * 0.5; // 0-0.5% for small trades
    }

    return NextResponse.json({
      from_coin: fromCoin.symbol,
      to_coin: toCoin.symbol,
      from_amount: amount,
      to_amount: toAmount.toFixed(6),
      exchange_rate: exchangeRate,
      price_impact: priceImpact,
      estimated_gas: "0.003",
      spread_percentage: spreadPercentage,
      quote_expires_at: new Date(Date.now() + 30000).toISOString(),
    });
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      {
        error: "Failed to calculate quote",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
