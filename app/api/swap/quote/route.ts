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

    const coinsResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${from_coin_id},${to_coin_id}&vs_currencies=usd`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!coinsResponse.ok) {
      throw new Error("Failed to fetch current prices");
    }

    const prices = await coinsResponse.json();
    const fromPrice = prices[from_coin_id]?.usd;
    const toPrice = prices[to_coin_id]?.usd;

    if (!fromPrice || !toPrice) {
      throw new Error("Price data unavailable");
    }

    const inputAmount = Number.parseFloat(amount);
    const usdValue = inputAmount * fromPrice; // USD value of input
    const fee = usdValue * 0.003; // 0.3% fee in USD
    const finalUsdValue = usdValue - fee;
    const outputAmount = finalUsdValue / toPrice; // Convert back to output coin

    // Calculate exchange rate (how many output coins per input coin)
    const rate = outputAmount / inputAmount;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      from_coin_id,
      to_coin_id,
      input_amount: amount,
      output_amount: outputAmount.toFixed(6),
      exchange_rate: rate,
      fee: fee.toFixed(6),
      fee_percentage: 0.3,
      price_impact: 0.1,
      minimum_received: (outputAmount * 0.98).toFixed(6), // 2% slippage tolerance
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
