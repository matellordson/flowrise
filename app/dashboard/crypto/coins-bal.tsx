import { auth } from "@/auth";
import { sql } from "@/lib/sql";

export const revalidate = 0;

export async function getBtcPrice() {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.bitcoin?.usd || "0.00";

  return data;
}

export async function getBtcBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM bitcoin WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching BTC balance:", error);
    return "0.00";
  }
}

export async function getBtcTotalBal() {
  const btcPrice = await getBtcPrice();
  const btcBal = await getBtcBal();
  const data = btcBal / btcPrice;

  return data;
}
