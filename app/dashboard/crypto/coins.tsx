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
  getUsdcbBal,
  getUsdcPrice,
  getUsdcTotalBal,
  getUsdtbBal,
  getUsdtPrice,
  getUsdtTotalBal,
  getXrpBal,
  getXrpPrice,
  getXrpTotalBal,
} from "./coins-bal";
import Image from "next/image";

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

  const usdcBal = await getUsdcbBal();
  const usdcPrice = await getUsdcPrice();
  const totalUsdc = await getUsdcTotalBal();

  const usdtBal = await getUsdtbBal();
  const usdtPrice = await getUsdtPrice();
  const totalUsdt = await getUsdtTotalBal();

  const xrpBal = await getXrpBal();
  const xrpPrice = await getXrpPrice();
  const totalXrp = await getXrpTotalBal();
  return (
    <div className="">
      {/* Bitcoin */}
      <Link href={"crypto/btc"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border p-1">
              <TokenBTC variant="mono" size={31} />
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
              <TokenETH variant="mono" size={31} />
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
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenSOL variant="mono" size={32} />
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
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenBNB variant="mono" size={32} />
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
      <Link href={"crypto/usdc"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenUSDC variant="mono" size={32} />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                USDC{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  USDC
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(usdcPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalUsdc)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(usdcBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>

      {/* USDT */}
      <Link href={"crypto/usdt"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenUSDT variant="mono" size={32} />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                Tether{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  USDT
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(usdtPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalUsdt)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(usdtBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>

      {/* XRP */}
      <Link href={"crypto/xrp"}>
        <div className="hover:bg-muted flex items-center justify-between rounded px-1 py-2">
          {/* left */}
          <div className="flex items-center justify-between gap-x-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full border">
              <TokenXRP variant="mono" size={32} />
            </div>
            <div className="">
              <p className="font-mono font-semibold tracking-tight">
                XRP{" "}
                <span className="bg-muted text-muted-foreground rounded px-2 text-xs tracking-wider">
                  XRP
                </span>
              </p>
              <p className="font-mono text-sm">
                {Number(xrpPrice).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="text-end">
            <p className="font-mono font-semibold tracking-tight">
              {Number(totalXrp)
                .toFixed(8)
                .replace(/\.?0+$/, "")}
            </p>
            <p className="font-mono text-sm">
              {Number(xrpBal).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
