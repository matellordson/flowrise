import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quote_id,
      from_coin_id,
      to_coin_id,
      input_amount,
      expected_output,
    } = body;

    if (!quote_id || !from_coin_id || !to_coin_id || !input_amount) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Simulate transaction processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock transaction success (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Transaction failed due to network congestion. Please try again.",
          error_code: "NETWORK_ERROR",
        },
        { status: 400 },
      );
    }

    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const actualOutput =
      Number.parseFloat(expected_output) * (0.98 + Math.random() * 0.04); // ±2% variance

    return NextResponse.json({
      success: true,
      transaction_hash: transactionHash,
      from_coin_id,
      to_coin_id,
      input_amount,
      actual_output: actualOutput.toFixed(6),
      fee_paid: (Number.parseFloat(input_amount) * 0.003).toFixed(6),
      timestamp: new Date().toISOString(),
      block_number: Math.floor(Math.random() * 1000000) + 18000000,
      gas_used: Math.floor(Math.random() * 50000) + 21000,
    });
  } catch (error) {
    console.error("Error executing swap:", error);
    return NextResponse.json(
      { error: "Failed to execute swap" },
      { status: 500 },
    );
  }
}
