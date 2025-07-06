import { TokenBTC } from "@web3icons/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import BTCBalance from "./balance";
import BTCChart from "./chart";
import { DepositDrawer } from "../deposit";
import { SendDrawer } from "../send";
import { SwapDrawer } from "../swap";

export default function BitcoinPage() {
  return (
    <div className="flex h-screen flex-col gap-x-3 gap-y-3 lg:flex-row">
      {/* nav */}
      <div className="bg-card h-full w-full space-y-5 rounded-xl p-3">
        <div className="flex items-center gap-x-2">
          <Link href={"/dashboard/crypto"}>
            <ChevronLeft size={30} />
          </Link>

          <div className="flex h-fit w-fit items-center justify-center rounded-full border p-1">
            <TokenBTC variant="mono" size={30} />
          </div>
          <div className="flex flex-col justify-center tracking-wide">
            <p className="font-semibold">Bitcoin</p>
            <p className="text-muted-foreground text-sm">BTC</p>
          </div>
        </div>
        <BTCBalance />
        <div className="flex items-center justify-around">
          <DepositDrawer />
          <SendDrawer />
          <SwapDrawer />
        </div>
        <BTCChart />
      </div>
      <div className="bg-card h-full w-full rounded-xl p-3"></div>
    </div>
  );
}
