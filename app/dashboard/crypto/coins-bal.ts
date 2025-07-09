import { auth } from "@/auth";
import { sql } from "@/lib/sql";

export const revalidate = 86400;

// Bitcoin

export async function getBtcPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/btc`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

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

// Ethereum

export async function getEthPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/eth`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

  return data;
}

export async function getEthBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM ethereum WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    return "0.00";
  }
}

export async function getEthTotalBal() {
  const ethPrice = await getEthPrice();
  const ethBal = await getEthBal();
  const data = ethBal / ethPrice;

  return data;
}

// Solana

export async function getSolPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/sol`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

  return data;
}

export async function getSolBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM solana WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching SOL balance:", error);
    return "0.00";
  }
}

export async function getSolTotalBal() {
  const solPrice = await getSolPrice();
  const solBal = await getSolBal();
  const data = solBal / solPrice;

  return data;
}

// BNB

export async function getBnbPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/bnb`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

  return data;
}

export async function getBnbBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM bnb WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching BNB balance:", error);
    return "0.00";
  }
}

export async function getBnbTotalBal() {
  const bnbPrice = await getBnbPrice();
  const bnbBal = await getBnbBal();
  const data = bnbBal / bnbPrice;

  return data;
}

// USDC

export async function getUsdcPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/usdc`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

  return data;
}

export async function getUsdcbBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM usdc WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching USDC balance:", error);
    return "0.00";
  }
}

export async function getUsdcTotalBal() {
  const usdcPrice = await getUsdcPrice();
  const usdcBal = await getUsdcbBal();
  const data = usdcBal / usdcPrice;

  return data;
}

// USDT

export async function getUsdtPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/usdt`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

  return data;
}

export async function getUsdtbBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM usdt WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching USDT balance:", error);
    return "0.00";
  }
}

export async function getUsdtTotalBal() {
  const usdtPrice = await getUsdtPrice();
  const usdtBal = await getUsdtbBal();
  const data = usdtBal / usdtPrice;

  return data;
}

// XRP

export async function getXrpPrice() {
  const domain = process.env.DOMAIN as string;
  const url = `${domain}/api/xrp`;
  const response = await fetch(url);
  const price = await response.json();
  const data = price?.quotes?.USD?.price || "0.00";

  return data;
}

export async function getXrpBal() {
  const session = await auth();
  try {
    const data =
      await sql`SELECT amount FROM xrp WHERE "user" = ${session?.user?.email}`;
    return data[0]?.amount || "0.00";
  } catch (error) {
    console.error("Error fetching USDT balance:", error);
    return "0.00";
  }
}

export async function getXrpTotalBal() {
  const xrpPrice = await getXrpPrice();
  const xrpBal = await getXrpBal();
  const data = xrpBal / xrpPrice;

  return data;
}
