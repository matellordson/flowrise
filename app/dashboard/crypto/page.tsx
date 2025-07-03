import Coins from "./coins";
import { DepositDrawer } from "./deposit";
import { SwapDrawer } from "./swap";
import { SendDrawer } from "./send";
import { Button } from "@/components/ui/button";

export default function CryptoDashboard() {
  return (
    <div className="w-full h-full lg:flex justify-between items-center gap-x-5">
      {/* crypto */}
      <div className="bg-card h-full w-full rounded-xl py-5 px-3 lg:px-5 lg:max-w-lg space-y-5">
        {/* crypto and action */}
        <div className="flex flex-col justify-center items-center gap-y-5">
          {/* balance */}
          <div className="text-center">
            <p className="text-3xl font-semibold font-mono lg:text-4xl">
              $200.40
            </p>
          </div>
          {/* actions */}
          <div className="flex justify-between items-center w-full lg:px-10">
            <DepositDrawer />
            <SendDrawer />
            <SwapDrawer />
          </div>
        </div>

        {/* trending topics */}
        <div className="space-y-2 lg:hidden">
          <p className="font-semibold tracking-tight text-xs">
            Trending Topics
          </p>
          <div className="h-20 w-full bg-muted rounded-xl"></div>
        </div>

        {/* crypto */}
        <Coins />
      </div>

      {/* news */}
      <div className="bg-card hidden lg:block h-full w-full rounded-xl p-5"></div>
    </div>
  );
}
