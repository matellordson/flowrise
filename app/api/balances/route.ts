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

    // Simulate SQL database query for default user
    // In real implementation: SELECT coin_symbol, usd_value FROM user_balances WHERE user_id = 'default_user'
    const mockUsdBalances = [
      { coin_symbol: "BTC", usd_value: 23000.0 },
      { coin_symbol: "ETH", usd_value: 5750.0 },
      { coin_symbol: "USDT", usd_value: 1000.0 },
      { coin_symbol: "BNB", usd_value: 1560.0 },
      { coin_symbol: "SOL", usd_value: 950.0 },
      { coin_symbol: "XRP", usd_value: 300.0 },
      { coin_symbol: "USDC", usd_value: 750.0 },
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
