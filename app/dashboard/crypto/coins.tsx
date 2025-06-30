"use client";

import { sql } from "@/lib/sql";
import { useState, useEffect } from "react";
import {
  TokenBNB,
  TokenBTC,
  TokenETH,
  TokenSOL,
  TokenUSDC,
  TokenUSDT,
  TokenXRP,
} from "@web3icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface DataType {
  bitcoin: string;
  ethereum: string;
  solana: string;
  usdc: string;
  usdt: string;
  bnb: string;
  xrp: string;
}

export default function Coins() {
  const { data: session } = useSession();
  const [data, setData] = useState<DataType>({
    bitcoin: "0",
    ethereum: "0",
    solana: "0",
    usdc: "0",
    usdt: "0",
    bnb: "0",
    xrp: "0",
  });

  useEffect(() => {
    async function getData() {
      if (!session?.user?.email) return;

      const result = await sql`
        SELECT bitcoin, ethereum, solana, bnb, usdc, usdt, xrp
        FROM crypto
        WHERE user_email = ${session.user.email}
      `;

      if (result[0]) {
        setData({
          bitcoin: result[0].bitcoin?.toString() || "0",
          ethereum: result[0].ethereum?.toString() || "0",
          solana: result[0].solana?.toString() || "0",
          usdc: result[0].usdc?.toString() || "0",
          usdt: result[0].usdt?.toString() || "0",
          bnb: result[0].bnb?.toString() || "0",
          xrp: result[0].xrp?.toString() || "0",
        });
      }
    }

    getData();
  }, [session]);

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
            <p className="font-semibold tracking-tight font-mono">
              {data.bitcoin}
            </p>
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
            <p className="font-semibold tracking-tight font-mono">
              {data.ethereum}
            </p>
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
            <p className="font-semibold tracking-tight font-mono">
              {data.solana}
            </p>
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
            <p className="font-semibold tracking-tight font-mono">{data.bnb}</p>
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
            <p className="font-semibold tracking-tight font-mono">
              {data.usdc}
            </p>
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
            <p className="font-semibold tracking-tight font-mono">
              {data.usdt}
            </p>
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
            <p className="font-semibold tracking-tight font-mono">{data.xrp}</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
