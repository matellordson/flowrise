import { ArrowDown, ArrowUp, History, RefreshCw } from "lucide-react";
import DepositMoney from "./deposit";
import ExchangeMoney from "./exchange";
import SendMoney from "./send";
import { Badge } from "@/components/ui/badge";

export default function Banking() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
      <div className="bg-card text-card-forground w-full rounded-xl p-5 lg:h-screen">
        <p className="pb-4 text-center font-mono text-3xl font-semibold lg:text-4xl">
          $400.00
        </p>
        <div className="flex w-full items-center justify-between gap-x-2">
          <SendMoney />
          <DepositMoney />
          <ExchangeMoney />
        </div>
      </div>
      <div className="bg-card text-card-foreground h-[18rem] w-full rounded-xl p-3 lg:h-screen">
        <p className="font-font-semibold flex items-center gap-x-1 pb-2 text-sm tracking-wide">
          Transactions
        </p>
        <div className="space-y-2">
          {/* Send */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                <ArrowUp size={20} />
              </div>
              <div className="text-sm">
                <p className="text-card-foreground w-[12rem] truncate">
                  Transfer to Matel Lordson Eddi
                </p>
                <p className="text-muted-foreground text-xs">
                  Jul 21st, 17:55:42
                </p>
              </div>
            </div>

            <div className="">
              <p className="text-right font-mono">-$1,000</p>
              <Badge variant={"default"}>Successful</Badge>
            </div>
          </div>

          {/* Receive */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                <ArrowDown size={20} />
              </div>
              <div className="text-sm">
                <p className="text-card-foreground w-[12rem] truncate">
                  Recieved from Matel Lordson Eddi
                </p>
                <p className="text-muted-foreground text-xs">
                  Jul 21st, 17:55:42
                </p>
              </div>
            </div>

            <div className="">
              <p className="text-right font-mono text-green-500 dark:text-green-300">
                +$1,000
              </p>
              <Badge variant={"default"}>Successful</Badge>
            </div>
          </div>

          {/* Exchange */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-x-2">
              <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                <RefreshCw size={20} />
              </div>
              <div className="text-sm">
                <p className="text-card-foreground w-[12rem] truncate">
                  Exchange from crypto
                </p>
                <p className="text-muted-foreground text-xs">
                  Jul 21st, 17:55:42
                </p>
              </div>
            </div>

            <div className="">
              <p className="text-right font-mono">+$1,000</p>
              <Badge variant={"default"}>Successful</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
