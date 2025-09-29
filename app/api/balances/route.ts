import { auth } from "@/auth";
import { sql } from "@/lib/sql";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("[v0] DATABASE_URL not configured");
      return Response.json(
        {
          success: false,
          error: "Database not configured",
          needsSetup: true,
          message: "Please add the Neon integration from Project Settings",
          balances: [],
        },
        { status: 503 },
      );
    }

    const session = await auth();

    if (!session?.user?.email) {
      console.log("[v0] No authenticated user found");
      return Response.json(
        {
          success: false,
          error: "Not authenticated",
          balances: [],
        },
        { status: 401 },
      );
    }

    console.log("[v0] Fetching balances for user:", session.user.email);

    let prices: any = {};
    try {
      const coinsResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,binancecoin,ripple,solana&vs_currencies=usd",
        {
          next: { revalidate: 60 },
        },
      );

      if (coinsResponse.ok) {
        prices = await coinsResponse.json();
        console.log("[v0] Fetched prices successfully");
      } else {
        console.log("[v0] CoinGecko API returned error:", coinsResponse.status);
        // Use fallback prices if API fails
        prices = {
          bitcoin: { usd: 45000 },
          ethereum: { usd: 2500 },
          tether: { usd: 1 },
          "usd-coin": { usd: 1 },
          binancecoin: { usd: 300 },
          ripple: { usd: 0.6 },
          solana: { usd: 95 },
        };
      }
    } catch (priceError) {
      console.log("[v0] Error fetching prices, using fallback:", priceError);
      prices = {
        bitcoin: { usd: 45000 },
        ethereum: { usd: 2500 },
        tether: { usd: 1 },
        "usd-coin": { usd: 1 },
        binancecoin: { usd: 300 },
        ripple: { usd: 0.6 },
        solana: { usd: 95 },
      };
    }

    let mockUsdBalances;
    try {
      console.log("[v0] Querying database for balances...");
      const [
        bitcoinResult,
        ethereumResult,
        solanaResult,
        bnbResult,
        usdcResult,
        usdtResult,
        xrpResult,
      ] = await Promise.all([
        sql`SELECT amount FROM bitcoin WHERE "user" = ${session.user.email} LIMIT 1`,
        sql`SELECT amount FROM ethereum WHERE "user" = ${session.user.email} LIMIT 1`,
        sql`SELECT amount FROM solana WHERE "user" = ${session.user.email} LIMIT 1`,
        sql`SELECT amount FROM bnb WHERE "user" = ${session.user.email} LIMIT 1`,
        sql`SELECT amount FROM usdc WHERE "user" = ${session.user.email} LIMIT 1`,
        sql`SELECT amount FROM usdt WHERE "user" = ${session.user.email} LIMIT 1`,
        sql`SELECT amount FROM xrp WHERE "user" = ${session.user.email} LIMIT 1`,
      ]);

      console.log("[v0] Database query successful");

      mockUsdBalances = [
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
    } catch (dbError: any) {
      console.error("[v0] Database error:", dbError.message);

      if (
        dbError.message?.includes("relation") ||
        dbError.message?.includes("does not exist")
      ) {
        return Response.json(
          {
            success: false,
            error: "Database tables not set up",
            needsSetup: true,
            message: "Please run the setup scripts from the /scripts folder",
            balances: [],
          },
          { status: 503 },
        );
      }

      return Response.json(
        {
          success: false,
          error: dbError.message || "Database error",
          needsSetup: true,
          message:
            "Database connection failed. Please check your Neon integration.",
          balances: [],
        },
        { status: 503 },
      );
    }

    const coinIdMap: { [key: string]: string } = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      BNB: "binancecoin",
      SOL: "solana",
      XRP: "ripple",
      USDC: "usd-coin",
    };

    const balances = mockUsdBalances.map((item) => {
      const coinId = coinIdMap[item.coin_symbol];
      const currentPrice = prices[coinId]?.usd || 1;
      const calculatedBalance = item.usd_value / currentPrice;

      return {
        coin_symbol: item.coin_symbol,
        balance: Number.parseFloat(calculatedBalance.toFixed(8)),
        usd_value: item.usd_value,
      };
    });

    console.log("[v0] Returning balances:", balances.length, "coins");

    return Response.json({
      success: true,
      balances,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[v0] Unexpected error in balances API:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to fetch balances",
        needsSetup: error.message?.includes("DATABASE_URL"),
        message: error.message?.includes("DATABASE_URL")
          ? "Please add the Neon integration from Project Settings"
          : "An unexpected error occurred",
        balances: [],
      },
      { status: 500 },
    );
  }
}
