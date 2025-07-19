import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/sql";

// GET /api/user-balances?email=user@example.com
export async function GET(request: NextRequest) {
  try {
    // Get the session to verify the user is authenticated
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email from query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 },
      );
    }

    // Security check: users can only fetch their own balances
    if (session.user.email !== email) {
      return NextResponse.json(
        { error: "Forbidden: Can only access your own balances" },
        { status: 403 },
      );
    }

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
      sql`SELECT amount FROM bitcoin WHERE "user" = ${email} LIMIT 1`,

      // Ethereum amount from ethereum table
      sql`SELECT amount FROM ethereum WHERE "user" = ${email} LIMIT 1`,

      // Solana amount from solana table
      sql`SELECT amount FROM solana WHERE "user" = ${email} LIMIT 1`,

      // BNB amount from bnb table
      sql`SELECT amount FROM bnb WHERE "user" = ${email} LIMIT 1`,

      // USDC amount from usdc table
      sql`SELECT amount FROM usdc WHERE "user" = ${email} LIMIT 1`,

      // USDT amount from usdt table
      sql`SELECT amount FROM usdt WHERE "user" = ${email} LIMIT 1`,

      // XRP amount from xrp table
      sql`SELECT amount FROM xrp WHERE "user" = ${email} LIMIT 1`,
    ]);

    // Extract balances or default to 0 - fix the field reference
    const balanceObject = {
      bitcoin: bitcoinResult[0]?.amount
        ? Number.parseFloat(bitcoinResult[0].amount)
        : 0,
      ethereum: ethereumResult[0]?.amount
        ? Number.parseFloat(ethereumResult[0].amount)
        : 0,
      solana: solanaResult[0]?.amount
        ? Number.parseFloat(solanaResult[0].amount)
        : 0,
      bnb: bnbResult[0]?.amount ? Number.parseFloat(bnbResult[0].amount) : 0,
      usdc: usdcResult[0]?.amount ? Number.parseFloat(usdcResult[0].amount) : 0,
      usdt: usdtResult[0]?.amount ? Number.parseFloat(usdtResult[0].amount) : 0,
      xrp: xrpResult[0]?.amount ? Number.parseFloat(xrpResult[0].amount) : 0,
    };

    return NextResponse.json(balanceObject);
  } catch (error) {
    console.error("Error fetching user balances:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
