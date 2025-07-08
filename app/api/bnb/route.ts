// /app/api/btc/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.coinpaprika.com/v1/tickers/bnb-binance-coin",
    {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
