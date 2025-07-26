import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd&include_24hr_change=true",
      {
        headers: {
          Accept: "application/json",
        },
        // Cache for 1 minute to avoid hitting rate limits
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract XRP data
    const xrpData = data.ripple;

    if (!xrpData) {
      throw new Error("XRP data not found in response");
    }

    // Return formatted data
    return NextResponse.json({
      success: true,
      data: {
        price: xrpData.usd,
        change24h: xrpData.usd_24h_change,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching XRP price:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch XRP price data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
