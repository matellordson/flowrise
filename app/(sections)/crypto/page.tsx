import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import Coins from "./coins";

export default function CryptoDashboard() {
  return (
    <div className="w-full h-full lg:flex justify-between items-center gap-x-5">
      {/* crypto */}
      <div className="bg-card h-full w-full rounded py-5 px-3 lg:px-5 lg:max-w-lg space-y-5">
        {/* crypto and action */}
        <div className="flex flex-col justify-center items-center gap-y-5">
          {/* balance */}
          <div className="text-center">
            <p className="text-2xl font-semibold font-mono lg:text-3xl">
              $200.40
            </p>
            <p className="text-sm text-muted-foreground">$0.00 (0.00%)</p>
          </div>

          {/* actions */}
          <div className="flex justify-evenly items-center w-full text-sm">
            <div className="flex flex-col justify-center items-center gap-y-1">
              <Link
                href={"#"}
                className="bg-muted rounded flex justify-center items-center h-11 w-11"
              >
                <ArrowUpRight />
              </Link>
              <span>Send</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-y-1">
              <Link
                href={"#"}
                className="bg-muted rounded flex justify-center items-center h-11 w-11"
              >
                <ArrowDownRight />
              </Link>
              <span>Receive</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-y-1">
              <Link
                href={"#"}
                className="bg-muted rounded flex justify-center items-center h-11 w-11"
              >
                <ArrowLeftRight />
              </Link>
              <span>Swap</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-y-1">
              <Link
                href={"#"}
                className="bg-muted rounded flex justify-center items-center h-11 w-11"
              >
                <Landmark />
              </Link>
              <span>Sell</span>
            </div>
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
