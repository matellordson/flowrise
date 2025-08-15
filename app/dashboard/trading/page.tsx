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
import DailyProfit from "./daily_profit";
import Image from "next/image";

export default async function Trading() {
  const session = await auth();
  const data =
    await sql`SELECT * FROM trading_accounts WHERE "user" = ${session?.user?.email}`;
  return (
    <div className="">
      {data.length === 0 ? (
        <div className="">
          <div className="m-10 mx-auto mt-10 h-[25rem] w-full max-w-xl rounded-xl border">
            <div className="h-[65%] w-full">
              <img
                src="/trading.png?height=400&width=400"
                alt="Trading Hero"
                className="h-64 w-full rounded-t-lg border object-cover"
              />
            </div>
            <div className="flex h-[35%] w-full flex-col items-center justify-center space-y-2 rounded-b-xl border border-t px-3 py-5">
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
          <div className="bg-card h-[40rem] w-full rounded-xl lg:h-screen lg:w-[50%]">
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
              <Badge variant={"outline"} className="py-1">
                <Bot /> Bot signal
                <span className="relative flex size-3">
                  {" "}
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>{" "}
                  <span className="relative inline-flex size-3 rounded-full bg-green-300"></span>
                </span>
              </Badge>
              <div className="h-full overflow-scroll pb-10 lg:h-full">
                <Pairs />
              </div>
            </div>
          </div>
          <div className="bg-card h-[40rem] w-full overflow-scroll rounded-xl p-4 lg:h-screen lg:w-[50%]">
            <DailyProfit />
          </div>
        </div>
      )}
    </div>
  );
}
