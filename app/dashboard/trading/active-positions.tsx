import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { sql } from "@/lib/sql";
import Image from "next/image";
import { auth } from "@/auth";
import { X } from "lucide-react";
import { TokenBTC, TokenETH, TokenUSDT, TokenXRP } from "@web3icons/react";

const fetchBitcoinPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/btc-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

const fetchEthereumPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/eth-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

const fetchUSDTPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/usdt-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

const fetchXRPPrice = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/xrp-usd`,
  );
  const { data } = await response.json();
  if (!response.ok) {
    console.log(response.status);
  }
  return data;
};

export default async function ActivePositions({
  accountID,
}: {
  accountID: string;
}) {
  const bitcoinPrice = await fetchBitcoinPrice();
  const ethereumPrice = await fetchEthereumPrice();
  const usdtPrice = await fetchUSDTPrice();
  const xrpPrice = await fetchXRPPrice();

  const session = await auth();

  interface dataType {
    id: string;
    pair: string;
    amount: number;
  }

  const getSignal =
    (await sql`SELECT id, pair, amount FROM signal WHERE open = true AND ${session?.user?.email} = ANY(users) ORDER BY created_at DESC;`) as dataType[];

  return (
    <div className="">
      <div className="mb-3 flex w-full items-center justify-between">
        <p className="text-sm font-semibold tracking-tight">
          Active Positions{" "}
          <Badge variant={"outline"} className="ml-1 font-semibold">
            {getSignal.length}
          </Badge>
        </p>
      </div>
      {getSignal.length < 1 ? (
        <div className="">
          <div className="flex h-[13rem] flex-col items-center justify-center">
            <X size={25} />
            <p>No active positions</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 overflow-scroll">
          {getSignal.map((data) => (
            <div key={data.id}>
              {data.pair == "BTC/USD" ? (
                <AlertDialog>
                  <div className="flex w-full cursor-pointer items-center justify-between rounded-xl border p-3">
                    {/* Left */}
                    <div className="flex items-center justify-start gap-x-2">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <TokenBTC variant="mono" size={32} />
                      </div>
                      <div className="">
                        <p className="text-tight font-semibold">BTC/USD</p>
                        <p className="text-muted-foreground text-sm">
                          Bitcoin vs US Dollar{" "}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end justify-center">
                      <p className="font-semibold">
                        {Number(bitcoinPrice.price).toLocaleString()}
                      </p>
                      <p
                        className={
                          bitcoinPrice.change24h >= 0
                            ? "text-sm text-green-500 dark:text-green-300"
                            : "text-sm text-red-500 dark:text-red-300"
                        }
                      >
                        {bitcoinPrice.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will execute the trade based on the current
                        signal. It cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          "use server";
                          await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
                        }}
                      >
                        Trade
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "ETH/USD" ? (
                <AlertDialog>
                  <div className="flex w-full cursor-pointer items-center justify-between rounded-xl border p-3">
                    {/* Left */}
                    <div className="flex items-center justify-start gap-x-2">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <TokenETH variant="mono" size={32} />
                      </div>
                      <div className="">
                        <p className="text-tight font-semibold">ETH/USD</p>
                        <p className="text-muted-foreground text-sm">
                          Ethereum vs US Dollar{" "}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end justify-center">
                      <p className="font-semibold">
                        {Number(ethereumPrice.price).toLocaleString()}
                      </p>
                      <p
                        className={
                          ethereumPrice.change24h >= 0
                            ? "text-sm text-green-500 dark:text-green-300"
                            : "text-sm text-red-500 dark:text-red-300"
                        }
                      >
                        {ethereumPrice.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will execute the trade based on the current
                        signal. It cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          "use server";
                          await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
                        }}
                      >
                        Trade
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "USDT/USD" ? (
                <AlertDialog>
                  <div className="flex w-full cursor-pointer items-center justify-between rounded-xl border p-3">
                    {/* Left */}
                    <div className="flex items-center justify-start gap-x-2">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <TokenUSDT variant="mono" size={32} />
                      </div>
                      <div className="">
                        <p className="text-tight font-semibold">USDT/USD</p>
                        <p className="text-muted-foreground text-sm">
                          Tether vs US Dollar{" "}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end justify-center">
                      <p className="font-semibold">
                        {Number(usdtPrice.price).toLocaleString()}
                      </p>
                      <p
                        className={
                          usdtPrice.change24h >= 0
                            ? "text-sm text-green-500 dark:text-green-300"
                            : "text-sm text-red-500 dark:text-red-300"
                        }
                      >
                        {usdtPrice.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will execute the trade based on the current
                        signal. It cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          "use server";
                          await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
                        }}
                      >
                        Trade
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "XRP/USD" ? (
                <AlertDialog>
                  <div className="flex w-full cursor-pointer items-center justify-between rounded-xl border p-3">
                    {/* Left */}
                    <div className="flex items-center justify-start gap-x-2">
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                        <TokenXRP variant="mono" size={32} />
                      </div>
                      <div className="">
                        <p className="text-tight font-semibold">XRP/USD</p>
                        <p className="text-muted-foreground text-sm">
                          XRP vs US Dollar{" "}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end justify-center">
                      <p className="font-semibold">
                        {Number(xrpPrice.price).toLocaleString()}
                      </p>
                      <p
                        className={
                          xrpPrice.change24h >= 0
                            ? "text-sm text-green-500 dark:text-green-300"
                            : "text-sm text-red-500 dark:text-red-300"
                        }
                      >
                        {xrpPrice.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will execute the trade based on the current
                        signal. It cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          "use server";
                          await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
                        }}
                      >
                        Trade
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
