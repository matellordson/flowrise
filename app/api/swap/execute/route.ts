import { type NextRequest, NextResponse } from "next/server";
import { AVAILABLE_TOKENS } from "@/lib/tokens";

export async function POST(request: NextRequest) {
  try {
    const {
      from_coin_id,
      to_coin_id,
      from_amount,
      to_amount,
      slippage,
      user_id,
    } = await request.json();

    // Validate input
    if (
      !from_coin_id ||
      !to_coin_id ||
      !from_amount ||
      !to_amount ||
      !user_id
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const fromAmountNum = Number.parseFloat(from_amount);
    const toAmountNum = Number.parseFloat(to_amount);
    const slippageNum = Number.parseFloat(slippage) || 0.5;

    if (fromAmountNum <= 0 || toAmountNum <= 0) {
      return NextResponse.json({ error: "Invalid amounts" }, { status: 400 });
    }

    // Get coins by ID (convert ID to array index)
    const fromCoin = AVAILABLE_TOKENS[from_coin_id - 1];
    const toCoin = AVAILABLE_TOKENS[to_coin_id - 1];

    if (!fromCoin || !toCoin) {
      throw new Error("Invalid coin ID");
    }

    // Validate balances and slippage
    if (fromAmountNum > fromCoin.balance) {
      throw new Error("Insufficient balance");
    }

    // Calculate slippage protection
    const minReceived = toAmountNum * (1 - slippageNum / 100);
    const actualSlippage = Math.random() * slippageNum * 0.8;
    const actualReceived = toAmountNum * (1 - actualSlippage / 100);

    if (actualReceived < minReceived) {
      throw new Error("Slippage tolerance exceeded");
    }

    // ============================================================================
    // SIMULATE BALANCE UPDATES (In real app, update database)
    // ============================================================================

    // Update balances in memory (in real app, this would be database updates)
    fromCoin.balance -= fromAmountNum;
    toCoin.balance += actualReceived;

    const transactionId = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      transaction_id: transactionId,
      from_coin: fromCoin.symbol,
      to_coin: toCoin.symbol,
      from_amount: from_amount,
      received_amount: actualReceived.toFixed(6),
      actual_slippage: actualSlippage.toFixed(2),
      gas_used: "0.0025",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Swap execution error:", error);

    return NextResponse.json(
      {
        error: error.message || "Swap execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
