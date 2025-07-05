import {
  TokenBNB,
  TokenBTC,
  TokenETH,
  TokenSOL,
  TokenUSDC,
  TokenUSDT,
  TokenXRP,
} from "@web3icons/react";
import Link from "next/link";
import { getBtcBal, getBtcPrice, getBtcTotalBal } from "./coins-bal";

export default async function Coins() {
  const btcBal = await getBtcBal();
  const btcPrice = await getBtcPrice();
  const totalBtc = await getBtcTotalBal();
  return (
    <div className="">
      {/* Bitcoin */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenBTC variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                Bitcoin{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  BTC
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(btcPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalBtc)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(btcBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>

      {/* Ethereum */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenETH variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">Ethereum</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {/* {data.ethereum} */}
            </p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* Solana */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenSOL variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">Solana</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {/* {data.solana} */}
            </p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* BNB */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenBNB variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">BNB</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {/* {data.bnb} */}
            </p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* USDC */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenUSDC variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">USDC</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {/* {data.usdc} */}
            </p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* USDT */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenUSDT variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">USDT</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {/* {data.usdt} */}
            </p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* XRP */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenXRP variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">XRP</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {/* {data.xrp} */}
            </p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
