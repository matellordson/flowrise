import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from_coin_id, to_coin_id, amount } = body;

    if (!from_coin_id || !to_coin_id || !amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Mock exchange rates - in a real app, this would come from a DEX API
    const exchangeRates: Record<string, Record<string, number>> = {
      bitcoin: {
        ethereum: 16.32,
        tether: 43250.5,
        binancecoin: 137.22,
        solana: 439.15,
      },
      ethereum: {
        bitcoin: 0.0613,
        tether: 2650.75,
        binancecoin: 8.41,
        solana: 26.91,
      },
      tether: {
        bitcoin: 0.0000231,
        ethereum: 0.000377,
        binancecoin: 0.00317,
        solana: 0.01015,
      },
      binancecoin: {
        bitcoin: 0.00729,
        ethereum: 0.119,
        tether: 315.2,
        solana: 3.2,
      },
      solana: {
        bitcoin: 0.00228,
        ethereum: 0.0372,
        tether: 98.45,
        binancecoin: 0.312,
      },
    };

    const rate = exchangeRates[from_coin_id]?.[to_coin_id] || 1;
    const outputAmount = Number.parseFloat(amount) * rate;
    const fee = outputAmount * 0.003; // 0.3% fee
    const finalAmount = outputAmount - fee;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      from_coin_id,
      to_coin_id,
      input_amount: amount,
      output_amount: finalAmount.toFixed(6),
      exchange_rate: rate,
      fee: fee.toFixed(6),
      fee_percentage: 0.3,
      price_impact: 0.1,
      minimum_received: (finalAmount * 0.98).toFixed(6), // 2% slippage tolerance
      quote_id: `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expires_at: new Date(Date.now() + 30000).toISOString(), // 30 seconds
    });
  } catch (error) {
    console.error("Error generating quote:", error);
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 },
    );
  }
}
