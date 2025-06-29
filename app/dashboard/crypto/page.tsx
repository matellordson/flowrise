import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  ChartLine,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import Coins from "./coins";
import { DepositDrawer } from "./deposit";
import { SwapDrawer } from "./swap";
import { SendDrawer } from "./send";
import { Button } from "@/components/ui/button";

export default function CryptoDashboard() {
  return (
    <div className="w-full h-full lg:flex justify-between items-center gap-x-5">
      {/* crypto */}
      <div className="bg-card h-full w-full rounded py-5 px-3 lg:px-5 lg:max-w-lg space-y-5">
        {/* crypto and action */}
        <div className="flex flex-col justify-center items-center gap-y-5">
          {/* balance */}
          <div className="text-center">
            <p className="text-2xl font-semibold font-mono lg:text-4xl">
              $200.40
            </p>
          </div>
          {/* actions */}
          <div className="flex justify-between items-center w-full">
            <DepositDrawer />
            <SendDrawer />
            <SwapDrawer />
            <Button variant="outline">
              <ChartLine />
              Market
            </Button>
          </div>
        </div>

        {/* trending topics */}
        <div className="space-y-1 lg:hidden">
          <p className="font-semibold tracking-tight">Trending Topics</p>
          <div className="h-20 w-full bg-muted rounded"></div>
        </div>

        {/* crypto */}
        <Coins />
      </div>

      {/* news */}
      <div className="bg-card hidden lg:block h-full w-full rounded p-5"></div>
    </div>
  );
}
