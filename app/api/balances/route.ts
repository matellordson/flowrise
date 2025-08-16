// Mock SQL database for user balances
export async function GET() {
  // Simulate SQL database query for default user
  // In real implementation: SELECT * FROM user_balances WHERE user_id = 'default_user'
  const mockDatabase = [
    { coin_symbol: "BTC", balance: 0.5, usd_value: 23000.0 },
    { coin_symbol: "ETH", balance: 2.3, usd_value: 5750.0 },
    { coin_symbol: "USDT", balance: 1000.0, usd_value: 1000.0 },
    { coin_symbol: "BNB", balance: 5.2, usd_value: 1560.0 },
    { coin_symbol: "SOL", balance: 10.0, usd_value: 950.0 },
    { coin_symbol: "XRP", balance: 500.0, usd_value: 300.0 },
    { coin_symbol: "USDC", balance: 750.0, usd_value: 750.0 },
  ];

  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Response.json({
    success: true,
    balances: mockDatabase,
    timestamp: new Date().toISOString(),
  });
}
