import { NextResponse } from "next/server";
import { sql } from "@/lib/sql";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, amount, coin } = body as {
      userEmail?: string | null;
      amount?: number;
      coin?: string;
    };

    if (!userEmail) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await sql`INSERT INTO crypto_deposit (user_email, amount, coin) VALUES (${userEmail}, ${amt}, ${coin})`;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
