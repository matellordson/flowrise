import { sql } from "@/lib/sql";
import TradingPlans from "./plans";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SendTrade from "./send";
import DepositTrade from "./deposit";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import Pairs from "./pairs";
import ActivePositions from "./active-positions";

export default async function Trading() {
  const session = await auth();
  const data =
    await sql`SELECT * FROM trading_accounts WHERE "user" = ${session?.user?.email}`;
  return (
    <div className="">
      {data.length === 0 ? (
        <div className="">
          <div className="m-10 mx-auto mt-10 h-[25rem] w-full max-w-xl rounded-xl border">
            <div className="h-[70%] w-full"></div>
            <div className="flex h-[30%] w-full flex-col items-center justify-center space-y-2 rounded-b-xl border border-t px-3 py-5">
              <p className="text-muted-foreground text-center text-xs leading-5 lg:text-sm lg:leading-6">
                You don't have an active trading account at the moment. Please
                select a trading plan to get started on your investment journey
                with us.
              </p>
              <Link href={"/dashboard/trading/create"}>
                <Button>Create an Account</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen flex-col gap-y-2 lg:flex-row lg:gap-x-2">
          <div className="bg-card h-[30rem] w-full rounded-xl lg:h-screen lg:w-[50%]">
            <div className="mt-5 flex flex-col items-center justify-center space-y-2">
              <Badge className="capitalize">{data[0].plan} plan</Badge>
              <p className="py-2 font-mono text-3xl font-semibold lg:text-4xl">
                {Number(data[0].balance).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
            <div className="mx-auto flex w-fit items-center justify-between gap-x-2">
              <SendTrade />
              <DepositTrade />
            </div>
            <div className="mt-10 h-[25rem] space-y-3 px-3">
              <Badge variant={"outline"} className="">
                <Bot /> Bot trading
                <div className="h-3 w-3 animate-pulse rounded-full border-2 border-green-500 bg-green-300"></div>
              </Badge>

              <Pairs accountID={data[0].id} />
            </div>
          </div>
          <div className="bg-card h-[25rem] w-full overflow-scroll rounded-xl p-4 lg:h-screen lg:w-[50%]">
            <ActivePositions accountID={data[0].id} />
          </div>
        </div>
      )}
    </div>
  );
}
