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
import {
  getBnbBal,
  getBnbPrice,
  getBnbTotalBal,
  getBtcBal,
  getBtcPrice,
  getBtcTotalBal,
  getEthBal,
  getEthPrice,
  getEthTotalBal,
  getSolBal,
  getSolPrice,
  getSolTotalBal,
} from "./coins-bal";

export const revalidate = 0;

export default async function Coins() {
  const btcBal = await getBtcBal();
  const btcPrice = await getBtcPrice();
  const totalBtc = await getBtcTotalBal();

  const ethBal = await getEthBal();
  const ethPrice = await getEthPrice();
  const totalEth = await getEthTotalBal();

  const solBal = await getSolBal();
  const solPrice = await getSolPrice();
  const totalSol = await getSolTotalBal();

  const bnbBal = await getBnbBal();
  const bnbPrice = await getBnbPrice();
  const totalBnb = await getBnbTotalBal();
  return (
    <div className="">
      {/* Bitcoin */}
      <Link href={"crypto/btc"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
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
      <Link href={"crypto/eth"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted bordervp-1 flex h-10 w-10 items-center justify-center rounded-full">
              <TokenETH variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                Ethereum{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  ETH
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(ethPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalEth)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(ethBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>

      {/* Solana */}
      <Link href={"crypto/sol"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
              <TokenSOL variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                Solana{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  SOL
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(solPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalSol)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(solBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>

      {/* BNB */}
      <Link href={"crypto/bnb"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
              <TokenBNB variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                Binance Coin{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  BNB
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(bnbPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalBnb)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(bnbBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>

      {/* USDC */}
      <Link href={"#"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
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
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
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
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
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
