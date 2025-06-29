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

export default function Coins() {
  return (
    <div className="">
      {/* Bitcoin */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenBTC variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">Bitcoin</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* Ethereum */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenETH variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">Ethereum</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* Solana */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenSOL variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">Solana</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* BNB */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenBNB variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">BNB</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* USDC */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenUSDC variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">USDC</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* USDT */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenUSDT variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">USDT</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>

      {/* XRP */}
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border flex justify-center items-center">
              <TokenXRP variant="mono" className="size-20" />
            </div>
            <div className="">
              <p className="font-semibold tracking-tight">XRP</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
