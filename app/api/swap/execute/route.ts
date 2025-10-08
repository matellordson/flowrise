import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/sql";

const COIN_TABLE_MAP: { [key: string]: string } = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  tether: "usdt",
  "usd-coin": "usdc",
  binancecoin: "bnb",
  ripple: "xrp",
  solana: "solana",
};

async function fetchCoinBalance(
  tableName: string,
  userEmail: string,
): Promise<number> {
  let result: any[];

  switch (tableName) {
    case "bitcoin":
      result =
        await sql`SELECT amount FROM bitcoin WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    case "ethereum":
      result =
        await sql`SELECT amount FROM ethereum WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    case "usdt":
      result =
        await sql`SELECT amount FROM usdt WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    case "usdc":
      result =
        await sql`SELECT amount FROM usdc WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    case "bnb":
      result =
        await sql`SELECT amount FROM bnb WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    case "xrp":
      result =
        await sql`SELECT amount FROM xrp WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    case "solana":
      result =
        await sql`SELECT amount FROM solana WHERE "user" = ${userEmail} LIMIT 1`;
      break;
    default:
      throw new Error(`Unsupported table: ${tableName}`);
  }

  return result?.[0]?.amount ? Number.parseFloat(result[0].amount) : 0;
}

async function updateCoinBalance(
  tableName: string,
  userEmail: string,
  newAmount: number,
): Promise<void> {
  switch (tableName) {
    case "bitcoin":
      await sql`UPDATE bitcoin SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    case "ethereum":
      await sql`UPDATE ethereum SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    case "usdt":
      await sql`UPDATE usdt SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    case "usdc":
      await sql`UPDATE usdc SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    case "bnb":
      await sql`UPDATE bnb SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    case "xrp":
      await sql`UPDATE xrp SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    case "solana":
      await sql`UPDATE solana SET amount = ${newAmount} WHERE "user" = ${userEmail}`;
      break;
    default:
      throw new Error(`Unsupported table: ${tableName}`);
  }
}

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

    const fromTable = COIN_TABLE_MAP[from_coin_id];
    const toTable = COIN_TABLE_MAP[to_coin_id];

    if (!fromTable || !toTable) {
      return NextResponse.json(
        { error: "Unsupported coin for swap" },
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

    const currentFromBalanceUSD = await fetchCoinBalance(fromTable, userEmail);
    const currentToBalanceUSD = await fetchCoinBalance(toTable, userEmail);

    const inputAmountNum = Number.parseFloat(input_amount);
    const swapUsdValue = inputAmountNum * fromPrice;

    if (swapUsdValue > currentFromBalanceUSD) {
      return NextResponse.json(
        {
          error: `Insufficient balance. You have $${currentFromBalanceUSD.toFixed(2)} but trying to swap $${swapUsdValue.toFixed(2)}`,
        },
        { status: 400 },
      );
    }

    const actualOutputNum =
      Number.parseFloat(expected_output) * (0.98 + Math.random() * 0.04);

    const fee = swapUsdValue * 0.003;
    const usdToTransfer = swapUsdValue - fee;

    const newFromBalanceUSD = Math.round(currentFromBalanceUSD - swapUsdValue);
    const newToBalanceUSD = Math.round(currentToBalanceUSD + usdToTransfer);

    await updateCoinBalance(fromTable, userEmail, newFromBalanceUSD);
    await updateCoinBalance(toTable, userEmail, newToBalanceUSD);

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
