import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/sql";

const COIN_TABLES = [
  { table: "bitcoin", symbol: "BTC", coinId: "bitcoin" },
  { table: "ethereum", symbol: "ETH", coinId: "ethereum" },
  { table: "bnb", symbol: "BNB", coinId: "binancecoin" },
  { table: "solana", symbol: "SOL", coinId: "solana" },
  { table: "usdt", symbol: "USDT", coinId: "tether" },
  { table: "usdc", symbol: "USDC", coinId: "usd-coin" },
  { table: "xrp", symbol: "XRP", coinId: "ripple" },
];

async function fetchTableBalance(
  table: string,
  userEmail: string,
): Promise<number> {
  let result: any[];

  switch (table) {
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
      throw new Error(`Unsupported table: ${table}`);
  }

  return result?.[0]?.amount ? Number.parseFloat(result[0].amount) : 0;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const coinIds = COIN_TABLES.map((c) => c.coinId).join(",");
    const pricesResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!pricesResponse.ok) {
      throw new Error("Failed to fetch current prices");
    }

    const prices = await pricesResponse.json();

    const balances = await Promise.all(
      COIN_TABLES.map(async ({ table, symbol, coinId }) => {
        try {
          const amountInCents = await fetchTableBalance(table, userEmail);
          const usdValue = amountInCents;
          const currentPrice = prices[coinId]?.usd || 0;
          const coinBalance = currentPrice > 0 ? usdValue / currentPrice : 0;

          return {
            coin_symbol: symbol,
            balance: coinBalance,
            usd_value: usdValue,
          };
        } catch (error) {
          console.error(`Error fetching balance for ${table}:`, error);
          return {
            coin_symbol: symbol,
            balance: 0,
            usd_value: 0,
          };
        }
      }),
    );

    return NextResponse.json({
      success: true,
      balances,
    });
  } catch (error: any) {
    console.error("Error fetching balances:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch balances" },
      { status: 500 },
    );
  }
}
