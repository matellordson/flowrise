import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const fetchBitcoinPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/btc-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

const fetchEthereumPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/eth-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

const fetchUSDTPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/usdt-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

export default async function Pairs() {
  const bitcoinPrice = await fetchBitcoinPrice();
  const ethereumPrice = await fetchEthereumPrice();
  const usdtPrice = await fetchUSDTPrice();

  return (
    <div className="">
      <div className="mb-3 flex w-full items-center justify-between">
        <p className="text-sm font-semibold tracking-tight">
          Open orders{" "}
          <Badge variant={"outline"} className="ml-1">
            3
          </Badge>
        </p>
        <Button size={"sm"}>Trade</Button>
      </div>
      <div className="space-y-2">
        {/* Bitcoin */}
        <div className="flex w-full items-center justify-between rounded-xl border p-3">
          {/* Left */}
          <div className="flex items-center justify-start gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Image
                src={
                  "https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC--big.svg"
                }
                alt="btc/usd"
                height={20}
                width={20}
                className="h-full w-full rounded-full dark:opacity-90"
              />
            </div>
            <div className="">
              <p className="text-tight font-semibold">BTC/USD</p>
              <p className="text-muted-foreground text-sm">
                Bitcoin vs US Dollar{" "}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end justify-center">
            <p className="font-semibold">
              {Number(bitcoinPrice.price).toLocaleString()}
            </p>
            <p
              className={
                bitcoinPrice.change24h >= 0
                  ? "text-sm text-green-500 dark:text-green-300"
                  : "text-sm text-red-500 dark:text-red-300"
              }
            >
              {bitcoinPrice.change24h.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Ethereum */}
        <div className="flex w-full items-center justify-between rounded-xl border p-3">
          {/* Left */}
          <div className="flex items-center justify-start gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Image
                src={
                  "https://s3-symbol-logo.tradingview.com/crypto/XTVCETH--big.svg"
                }
                alt="eth/usd"
                height={20}
                width={20}
                className="h-full w-full rounded-full dark:opacity-90"
              />
            </div>
            <div className="">
              <p className="text-tight font-semibold">ETH/USD</p>
              <p className="text-muted-foreground text-sm">
                Ethereum vs US Dollar
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end justify-center">
            <p className="font-semibold">
              {Number(ethereumPrice.price).toLocaleString()}
            </p>
            <p
              className={
                ethereumPrice.change24h >= 0
                  ? "text-sm text-green-500 dark:text-green-300"
                  : "text-sm text-red-500 dark:text-red-300"
              }
            >
              {ethereumPrice.change24h.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* USDT */}
        <div className="flex w-full items-center justify-between rounded-xl border p-3">
          {/* Left */}
          <div className="flex items-center justify-start gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <Image
                src={
                  "https://s3-symbol-logo.tradingview.com/crypto/XTVCUSDT--big.svg"
                }
                alt="btc/usd"
                height={20}
                width={20}
                className="h-full w-full rounded-full dark:opacity-90"
              />
            </div>
            <div className="">
              <p className="text-tight font-semibold">USDT/USD</p>
              <p className="text-muted-foreground text-sm">
                Tether vs US Dollar
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end justify-center">
            <p className="font-semibold">
              {Number(usdtPrice.price).toLocaleString()}
            </p>
            <p
              className={
                usdtPrice.change24h >= 0
                  ? "text-sm text-green-500 dark:text-green-300"
                  : "text-sm text-red-500 dark:text-red-300"
              }
            >
              {usdtPrice.change24h.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
