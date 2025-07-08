import { auth } from "@/auth";
import { sql } from "@/lib/sql";

export const revalidate = 0;

// Bitcoin

export async function getBtcPrice() {
  const res = await fetch("https://api.coinpaprika.com/v1/tickers/btc-bitcoin");
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
  const res = await fetch(
    "https://api.coinpaprika.com/v1/tickers/eth-ethereum",
  );
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
  const res = await fetch("https://api.coinpaprika.com/v1/tickers/sol-solana");
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
  const res = await fetch(
    "https://api.coinpaprika.com/v1/tickers/bnb-binance-coin",
  );
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
  const res = await fetch(
    "https://api.coinpaprika.com/v1/tickers/usdc-usd-coin",
  );
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
  const res = await fetch("https://api.coinpaprika.com/v1/tickers/usdt-tether");
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
  const res = await fetch("https://api.coinpaprika.com/v1/tickers/xrp-xrp");
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
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
