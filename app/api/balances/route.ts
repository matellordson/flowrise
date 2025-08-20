import { auth } from "@/auth";
import { sql } from "@/lib/sql";

// Mock SQL database for user balances
export async function GET() {
  try {
    // Fetch current prices from CoinGecko
    const coinsResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,ripple,solana&vs_currencies=usd",
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      },
    );

    const prices = await coinsResponse.json();
    const session = await auth();

    // Simulate SQL database query for default user
    // In real implementation: SELECT coin_symbol, usd_value FROM user_balances WHERE user_id = 'default_user'
    // Fetch balances from different tables for each coin
    const [
      bitcoinResult,
      ethereumResult,
      solanaResult,
      bnbResult,
      usdcResult,
      usdtResult,
      xrpResult,
    ] = await Promise.all([
      // Bitcoin amount from bitcoin table
      sql`SELECT amount FROM bitcoin WHERE "user" = ${session?.user?.email} LIMIT 1`,

      // Ethereum amount from ethereum table
      sql`SELECT amount FROM ethereum WHERE "user" = ${session?.user?.email} LIMIT 1`,

      // Solana amount from solana table
      sql`SELECT amount FROM solana WHERE "user" = ${session?.user?.email} LIMIT 1`,

      // BNB amount from bnb table
      sql`SELECT amount FROM bnb WHERE "user" = ${session?.user?.email} LIMIT 1`,

      // USDC amount from usdc table
      sql`SELECT amount FROM usdc WHERE "user" = ${session?.user?.email} LIMIT 1`,

      // USDT amount from usdt table
      sql`SELECT amount FROM usdt WHERE "user" = ${session?.user?.email} LIMIT 1`,

      // XRP amount from xrp table
      sql`SELECT amount FROM xrp WHERE "user" = ${session?.user?.email} LIMIT 1`,
    ]);
    const mockUsdBalances = [
      {
        coin_symbol: "BTC",
        usd_value: bitcoinResult[0]?.amount
          ? Number.parseFloat(bitcoinResult[0].amount)
          : 0,
      },
      {
        coin_symbol: "ETH",
        usd_value: ethereumResult[0]?.amount
          ? Number.parseFloat(ethereumResult[0].amount)
          : 0,
      },
      {
        coin_symbol: "USDT",
        usd_value: usdtResult[0]?.amount
          ? Number.parseFloat(usdtResult[0].amount)
          : 0,
      },
      {
        coin_symbol: "BNB",
        usd_value: bnbResult[0]?.amount
          ? Number.parseFloat(bnbResult[0].amount)
          : 0,
      },
      {
        coin_symbol: "SOL",
        usd_value: solanaResult[0]?.amount
          ? Number.parseFloat(solanaResult[0].amount)
          : 0,
      },
      {
        coin_symbol: "XRP",
        usd_value: xrpResult[0]?.amount
          ? Number.parseFloat(xrpResult[0].amount)
          : 0,
      },
      {
        coin_symbol: "USDC",
        usd_value: usdcResult[0]?.amount
          ? Number.parseFloat(usdcResult[0].amount)
          : 0,
      },
    ];

    const coinIdMap: { [key: string]: string } = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      BNB: "binancecoin",
      SOL: "solana",
      XRP: "ripple",
      USDC: "usd-coin",
    };

    const mockDatabase = mockUsdBalances.map((item) => {
      const coinId = coinIdMap[item.coin_symbol];
      const currentPrice = prices[coinId]?.usd || 1;
      const calculatedBalance = item.usd_value / currentPrice;

      return {
        coin_symbol: item.coin_symbol,
        balance: Number.parseFloat(calculatedBalance.toFixed(8)), // Round to 8 decimal places
        usd_value: item.usd_value,
      };
    });

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return Response.json({
      success: true,
      balances: mockDatabase,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch prices:", error);

    const fallbackDatabase = [
      { coin_symbol: "BTC", balance: 0.5, usd_value: 23000.0 },
      { coin_symbol: "ETH", balance: 2.3, usd_value: 5750.0 },
      { coin_symbol: "USDT", balance: 1000.0, usd_value: 1000.0 },
      { coin_symbol: "BNB", balance: 5.2, usd_value: 1560.0 },
      { coin_symbol: "SOL", balance: 10.0, usd_value: 950.0 },
      { coin_symbol: "XRP", balance: 500.0, usd_value: 300.0 },
      { coin_symbol: "USDC", balance: 750.0, usd_value: 750.0 },
    ];

    return Response.json({
      success: true,
      balances: fallbackDatabase,
      timestamp: new Date().toISOString(),
    });
  }
}
