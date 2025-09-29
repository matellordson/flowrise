import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/sql";

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

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Map coin IDs to table names
    const coinTableMap: { [key: string]: string } = {
      bitcoin: "bitcoin",
      ethereum: "ethereum",
      tether: "usdt",
      "usd-coin": "usdc",
      binancecoin: "bnb",
      ripple: "xrp",
      solana: "solana",
    };

    const fromTable = coinTableMap[from_coin_id];
    const toTable = coinTableMap[to_coin_id];

    if (!fromTable || !toTable) {
      return NextResponse.json(
        { error: "Unsupported coin for swap" },
        { status: 400 },
      );
    }

    // Fetch current prices to calculate USD values
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

    // Fetch FROM coin balance (stored as USD value in database)
    let fromBalanceResult;
    if (fromTable === "bitcoin") {
      fromBalanceResult =
        await sql`SELECT amount FROM bitcoin WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (fromTable === "ethereum") {
      fromBalanceResult =
        await sql`SELECT amount FROM ethereum WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (fromTable === "usdt") {
      fromBalanceResult =
        await sql`SELECT amount FROM usdt WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (fromTable === "usdc") {
      fromBalanceResult =
        await sql`SELECT amount FROM usdc WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (fromTable === "bnb") {
      fromBalanceResult =
        await sql`SELECT amount FROM bnb WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (fromTable === "xrp") {
      fromBalanceResult =
        await sql`SELECT amount FROM xrp WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (fromTable === "solana") {
      fromBalanceResult =
        await sql`SELECT amount FROM solana WHERE "user" = ${userEmail} LIMIT 1`;
    }

    // Fetch TO coin balance (stored as USD value in database)
    let toBalanceResult;
    if (toTable === "bitcoin") {
      toBalanceResult =
        await sql`SELECT amount FROM bitcoin WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (toTable === "ethereum") {
      toBalanceResult =
        await sql`SELECT amount FROM ethereum WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (toTable === "usdt") {
      toBalanceResult =
        await sql`SELECT amount FROM usdt WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (toTable === "usdc") {
      toBalanceResult =
        await sql`SELECT amount FROM usdc WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (toTable === "bnb") {
      toBalanceResult =
        await sql`SELECT amount FROM bnb WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (toTable === "xrp") {
      toBalanceResult =
        await sql`SELECT amount FROM xrp WHERE "user" = ${userEmail} LIMIT 1`;
    } else if (toTable === "solana") {
      toBalanceResult =
        await sql`SELECT amount FROM solana WHERE "user" = ${userEmail} LIMIT 1`;
    }

    const currentFromBalanceUSD = fromBalanceResult?.[0]?.amount
      ? Number.parseFloat(fromBalanceResult[0].amount)
      : 0;
    const currentToBalanceUSD = toBalanceResult?.[0]?.amount
      ? Number.parseFloat(toBalanceResult[0].amount)
      : 0;

    const inputAmountNum = Number.parseFloat(input_amount);
    const swapUsdValue = inputAmountNum * fromPrice; // USD value being swapped

    console.log("[v0] Swap calculation:", {
      inputAmount: inputAmountNum,
      fromPrice,
      swapUsdValue,
      currentFromBalanceUSD,
      currentToBalanceUSD,
    });

    if (swapUsdValue > currentFromBalanceUSD) {
      return NextResponse.json(
        {
          error: `Insufficient balance. You have $${currentFromBalanceUSD.toFixed(2)} but trying to swap $${swapUsdValue.toFixed(2)}`,
        },
        { status: 400 },
      );
    }

    // Calculate actual output with slight variance (±2%)
    const actualOutputNum =
      Number.parseFloat(expected_output) * (0.98 + Math.random() * 0.04);

    const fee = swapUsdValue * 0.003; // 0.3% fee
    const usdToTransfer = swapUsdValue - fee;

    const newFromBalanceUSD = currentFromBalanceUSD - swapUsdValue;
    const newToBalanceUSD = currentToBalanceUSD + usdToTransfer;

    console.log("[v0] Balance updates:", {
      newFromBalanceUSD,
      newToBalanceUSD,
      fee,
      usdToTransfer,
    });

    // Update FROM coin balance (deduct USD value)
    if (fromTable === "bitcoin") {
      await sql`UPDATE bitcoin SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (fromTable === "ethereum") {
      await sql`UPDATE ethereum SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (fromTable === "usdt") {
      await sql`UPDATE usdt SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (fromTable === "usdc") {
      await sql`UPDATE usdc SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (fromTable === "bnb") {
      await sql`UPDATE bnb SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (fromTable === "xrp") {
      await sql`UPDATE xrp SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (fromTable === "solana") {
      await sql`UPDATE solana SET amount = ${newFromBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    }

    // Update TO coin balance (add USD value)
    if (toTable === "bitcoin") {
      await sql`UPDATE bitcoin SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (toTable === "ethereum") {
      await sql`UPDATE ethereum SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (toTable === "usdt") {
      await sql`UPDATE usdt SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (toTable === "usdc") {
      await sql`UPDATE usdc SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (toTable === "bnb") {
      await sql`UPDATE bnb SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (toTable === "xrp") {
      await sql`UPDATE xrp SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    } else if (toTable === "solana") {
      await sql`UPDATE solana SET amount = ${newToBalanceUSD.toString()} WHERE "user" = ${userEmail}`;
    }

    // Simulate transaction processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    return NextResponse.json({
      success: true,
      transaction_hash: transactionHash,
      from_coin_id,
      to_coin_id,
      input_amount,
      actual_output: actualOutputNum.toFixed(6),
      fee_paid: fee.toFixed(2),
      timestamp: new Date().toISOString(),
      block_number: Math.floor(Math.random() * 1000000) + 18000000,
      gas_used: Math.floor(Math.random() * 50000) + 21000,
    });
  } catch (error: any) {
    console.error("Error executing swap:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute swap" },
      { status: 500 },
    );
  }
}
