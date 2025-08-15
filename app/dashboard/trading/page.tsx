import { sql } from "@/lib/sql";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SendTrade from "./send";
import DepositTrade from "./deposit";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import Pairs from "./pairs";
import DailyProfit from "./daily_profit";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
        <div className="mx-auto flex flex-col gap-4 lg:flex-row lg:gap-6 lg:p-4">
          {/* Mobile Tabs Layout (hidden on lg) */}
          <div className="lg:hidden">
            <div className="bg-card mb-4 rounded-xl p-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Badge className="capitalize">{data[0].plan} plan</Badge>
                <p className="font-mono text-3xl font-semibold">
                  {Number(data[0].balance).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <div className="flex items-center justify-center gap-x-3">
                  <SendTrade />
                  <DepositTrade />
                </div>
              </div>
            </div>

            <Tabs defaultValue="pairs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pairs" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Trading Pairs
                </TabsTrigger>
                <TabsTrigger value="profit">Daily Profit</TabsTrigger>
              </TabsList>

              <TabsContent value="pairs" className="mt-4">
                <div className="bg-card rounded-xl p-4">
                  <div className="mb-4">
                    <Badge variant={"outline"} className="py-1">
                      <Bot className="mr-1 h-3 w-3" /> Bot signal
                      <span className="relative ml-2 flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-green-300"></span>
                      </span>
                    </Badge>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    <Pairs />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="profit" className="mt-4">
                <div className="bg-card rounded-xl p-4">
                  <div className="max-h-[60vh] overflow-y-auto">
                    <DailyProfit />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Two-Column Layout (visible on lg+) */}
          <div className="hidden w-full lg:flex lg:gap-6">
            {/* Left Column: Account Balance + Trading Pairs */}
            <div className="flex flex-col gap-6 lg:w-1/2">
              {/* Account Balance Section */}
              <div className="bg-card rounded-xl p-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Badge className="capitalize">{data[0].plan} plan</Badge>
                  <p className="font-mono text-3xl font-semibold lg:text-4xl">
                    {Number(data[0].balance).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <div className="flex items-center justify-center gap-x-3">
                    <SendTrade />
                    <DepositTrade />
                  </div>
                </div>
              </div>

              {/* Trading Pairs Section */}
              <div className="bg-card rounded-xl p-6">
                <div className="mb-6">
                  <Badge variant={"outline"} className="px-3 py-2">
                    <Bot className="mr-2 h-4 w-4" /> Bot signal
                    <span className="relative ml-2 flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-green-300"></span>
                    </span>
                  </Badge>
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  <Pairs />
                </div>
              </div>
            </div>

            {/* Right Column: Daily Profit */}
            <div className="bg-card rounded-xl p-6 lg:w-1/2">
              <div className="max-h-[80vh] overflow-y-auto pr-2">
                <DailyProfit />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
