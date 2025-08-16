// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { sql } from "@/lib/sql";
// import Image from "next/image";
// import { auth } from "@/auth";
// import { X } from "lucide-react";
// import { TokenBTC, TokenETH, TokenUSDT, TokenXRP } from "@web3icons/react";
// import BTCChartDark, { BTCChartLight } from "../crypto/btc/chart";
// import { ETHChartLight, ETHChartDark } from "../crypto/eth/chart";
// import USDTChartDark from "../crypto/usdt/chart";
// import { USDTChartLight } from "../crypto/usdt/chart";
// import { XRPChartLight } from "../crypto/xrp/chart";
// import XRPChartDark from "../crypto/xrp/chart";

import { auth } from "@/auth";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { sql } from "@/lib/sql";
import { TokenBTC, TokenETH, TokenUSDT, TokenXRP } from "@web3icons/react";
import { MoveRight, X } from "lucide-react";
import BTCChartDark, { BTCChartLight } from "../crypto/btc/chart";
import { SpawnSyncOptionsWithStringEncoding } from "child_process";
import { ETHChartDark, ETHChartLight } from "../crypto/eth/chart";
import USDTChartDark, { USDTChartLight } from "../crypto/usdt/chart";
import XRPChartDark, { XRPChartLight } from "../crypto/xrp/chart";
import XAUTChartDark, { XAUTChartLight } from "../crypto/xaut/chart";

// const fetchBitcoinPrice = async () => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/btc-usd`,
//   );
//   const { data } = await response.json();
//   if (!response.ok) {
//     console.log(response.status);
//   }
//   return data;
// };

// const fetchEthereumPrice = async () => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/eth-usd`,
//   );
//   const { data } = await response.json();
//   if (!response.ok) {
//     console.log(response.status);
//   }
//   return data;
// };

// const fetchUSDTPrice = async () => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/usdt-usd`,
//   );
//   const { data } = await response.json();
//   if (!response.ok) {
//     console.log(response.status);
//   }
//   return data;
// };

// const fetchXRPPrice = async () => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/xrp-usd`,
//   );
//   const { data } = await response.json();
//   if (!response.ok) {
//     console.log(response.status);
//   }
//   return data;
// };

// const fetchGoldPrice = async () => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/pairs/xaust-usd`,
//   );
//   const { data } = await response.json();
//   if (!response.ok) {
//     console.log(response.status);
//   }
//   return data;
// };

// export default async function Pairs({ accountID }: { accountID: string }) {
//   const bitcoinPrice = await fetchBitcoinPrice();
//   const ethereumPrice = await fetchEthereumPrice();
//   const usdtPrice = await fetchUSDTPrice();
//   const xrpPrice = await fetchXRPPrice();
//   const goldPrice = await fetchGoldPrice();
//   const session = await auth();

//   interface dataType {
//     id: string;
//     pair: string;
//     trade_end: Date;
//   }

//   const getSignal = (await sql`SELECT id, pair, created_at, users, trade_end
//   FROM signal
//   WHERE open = true
//   AND (users IS NULL OR NOT (users @> ARRAY[${session?.user?.email}]))
//   ORDER BY created_at DESC;`) as dataType[];

//   return (k
//     <div className="">
//       <div className="mb-3 flex w-full items-center justify-between">
//         <p className="text-sm font-semibold tracking-tight">
//           Open orders{" "}
//           <Badge variant={"outline"} className="ml-1 font-semibold">
//             {getSignal.length}
//           </Badge>
//         </p>
//       </div>
//       {getSignal.length < 1 ? (
//         <div className="">
//           <div className="flex h-[15rem] flex-col items-center justify-center">
//             <X size={25} />
//             <p>No open orders</p>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2 overflow-scroll">
//           {getSignal.map((data) => (
//             <div key={data.id}>
//               {data.pair == "BTC/USD" ? (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <div className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors">
//                       {/* Left */}
//                       <div className="flex items-center justify-start gap-x-2">
//                         <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
//                           <TokenBTC variant="mono" size={32} />
//                         </div>
//                         <div className="">
//                           <p className="text-tight font-semibold">BTC/USD</p>
//                           <p className="text-muted-foreground text-sm">
//                             Bitcoin vs US Dollar{" "}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Right */}
//                       <div className="flex flex-col items-end justify-center">
//                         <p className="font-semibold">
//                           {Number(bitcoinPrice.price).toLocaleString("en-US", {
//                             currency: "USD",
//                             style: "currency",
//                           })}
//                         </p>
//                         <p
//                           className={
//                             bitcoinPrice.change24h >= 0
//                               ? "text-sm text-green-500 dark:text-green-300"
//                               : "text-sm text-red-500 dark:text-red-300"
//                           }
//                         >
//                           {bitcoinPrice.change24h.toFixed(2)}%
//                         </p>
//                       </div>
//                     </div>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Execute BTC/USD</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         <p className="font-semibold">
//                           Trade ends:{" "}
//                           <span className="font-normal">
//                             {data.trade_end.toLocaleDateString()}
//                           </span>{" "}
//                         </p>
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <div className="dark:hidden">
//                       <BTCChartLight />
//                     </div>
//                     <div className="hidden dark:block">
//                       <BTCChartDark />
//                     </div>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={async () => {
//                           "use server";
//                           await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
//                         }}
//                       >
//                         Trade
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               ) : data.pair == "ETH/USD" ? (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <div className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors">
//                       {/* Left */}
//                       <div className="flex items-center justify-start gap-x-2">
//                         <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
//                           <TokenETH variant="mono" size={32} />
//                         </div>
//                         <div className="">
//                           <p className="text-tight font-semibold">ETH/USD</p>
//                           <p className="text-muted-foreground text-sm">
//                             Ethereum vs US Dollar{" "}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Right */}
//                       <div className="flex flex-col items-end justify-center">
//                         <p className="font-semibold">
//                           {Number(ethereumPrice.price).toLocaleString("en-US", {
//                             currency: "USD",
//                             style: "currency",
//                           })}
//                         </p>
//                         <p
//                           className={
//                             ethereumPrice.change24h >= 0
//                               ? "text-sm text-green-500 dark:text-green-300"
//                               : "text-sm text-red-500 dark:text-red-300"
//                           }
//                         >
//                           {ethereumPrice.change24h.toFixed(2)}%
//                         </p>
//                       </div>
//                     </div>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Execute ETH/USD</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         <p className="font-semibold">
//                           Trade ends:{" "}
//                           <span className="font-normal">
//                             {data.trade_end.toLocaleDateString()}
//                           </span>{" "}
//                         </p>
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <div className="dark:hidden">
//                       <ETHChartLight />
//                     </div>
//                     <div className="hidden dark:block">
//                       <ETHChartDark />
//                     </div>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={async () => {
//                           "use server";
//                           await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
//                         }}
//                       >
//                         Trade
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               ) : data.pair == "USDT/USD" ? (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <div className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors">
//                       {/* Left */}
//                       <div className="flex items-center justify-start gap-x-2">
//                         <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
//                           <TokenUSDT variant="mono" size={32} />
//                         </div>
//                         <div className="">
//                           <p className="text-tight font-semibold">USDT/USD</p>
//                           <p className="text-muted-foreground text-sm">
//                             Tether vs US Dollar{" "}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Right */}
//                       <div className="flex flex-col items-end justify-center">
//                         <p className="font-semibold">
//                           {Number(usdtPrice.price).toLocaleString("en-US", {
//                             currency: "USD",
//                             style: "currency",
//                           })}
//                         </p>
//                         <p
//                           className={
//                             usdtPrice.change24h >= 0
//                               ? "text-sm text-green-500 dark:text-green-300"
//                               : "text-sm text-red-500 dark:text-red-300"
//                           }
//                         >
//                           {usdtPrice.change24h.toFixed(2)}%
//                         </p>
//                       </div>
//                     </div>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Execute USDT/USD</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         <p className="font-semibold">
//                           Trade ends:{" "}
//                           <span className="font-normal">
//                             {data.trade_end.toLocaleDateString()}
//                           </span>{" "}
//                         </p>
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <div className="dark:hidden">
//                       <USDTChartLight />
//                     </div>
//                     <div className="hidden dark:block">
//                       <USDTChartDark />
//                     </div>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={async () => {
//                           "use server";
//                           await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
//                         }}
//                       >
//                         Trade
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               ) : data.pair == "XRP/USD" ? (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <div className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors">
//                       {/* Left */}
//                       <div className="flex items-center justify-start gap-x-2">
//                         <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
//                           <TokenXRP variant="mono" size={32} />
//                         </div>
//                         <div className="">
//                           <p className="text-tight font-semibold">XRP/USD</p>
//                           <p className="text-muted-foreground text-sm">
//                             XRP vs US Dollar{" "}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Right */}
//                       <div className="flex flex-col items-end justify-center">
//                         <p className="font-semibold">
//                           {Number(xrpPrice.price).toLocaleString("en-US", {
//                             currency: "USD",
//                             style: "currency",
//                           })}
//                         </p>
//                         <p
//                           className={
//                             xrpPrice.change24h >= 0
//                               ? "text-sm text-green-500 dark:text-green-300"
//                               : "text-sm text-red-500 dark:text-red-300"
//                           }
//                         >
//                           {xrpPrice.change24h.toFixed(2)}%
//                         </p>
//                       </div>
//                     </div>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Execute XRP/USD</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         <p className="font-semibold">
//                           Trade ends:{" "}
//                           <span className="font-normal">
//                             {data.trade_end.toLocaleDateString()}
//                           </span>{" "}
//                         </p>
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <div className="dark:hidden">
//                       <XRPChartLight />
//                     </div>
//                     <div className="hidden dark:block">
//                       <XRPChartDark />
//                     </div>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={async () => {
//                           "use server";
//                           await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
//                         }}
//                       >
//                         Trade
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               ) : (
//                 ""
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export default async function Pairs() {
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

  const fetchXAUTPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd&include_24hr_change=true",
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("CoinGecko API error");
      }
      // Transform CoinGecko response to match expected format
      return {
        price: data["tether-gold"].usd,
        change24h: data["tether-gold"].usd_24h_change,
      };
    } catch (error) {
      console.error("Failed to fetch XAUT price from CoinGecko:", error);
      return { price: 2650, change24h: 0.8 };
    }
  };

  const bitcoinPrice = await fetchBitcoinPrice();
  const ethereumPrice = await fetchEthereumPrice();
  const usdtPrice = await fetchUSDTPrice();
  const xrpPrice = await fetchXRPPrice();
  const goldPrice = await fetchXAUTPrice();
  const session = await auth();

  interface dataType {
    id: string;
    pair: string;
    action: string;
    created_at: Date;
    trade_end: Date;
  }

  const getSignal = (await sql`SELECT s.*
FROM signal s
JOIN trading_accounts t
  ON s.plan = t.plan
WHERE t."user" = ${session?.user?.email}
  ORDER BY created_at DESC;`) as dataType[];
  return (
    <div className="">
      {getSignal.length < 1 ? (
        <div className="">
          <div className="flex h-[15rem] flex-col items-center justify-center">
            <X size={25} />
            <p>No open orders</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {getSignal.map((data) => (
            <div className="" key={data.id}>
              {data.pair == "BTC/USD" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between border-l-2 ${data.action == "buy" ? "border-green-400" : "border-red-400"} p-3 transition-colors`}
                    >
                      {/* Left */}
                      <div className="flex items-center justify-start gap-x-2">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <TokenBTC variant="mono" size={32} />
                        </div>
                        <div className="">
                          <p className="text-tight font-semibold">
                            BTC/USD{" "}
                            <span
                              className={`ml-2 rounded-sm capitalize ${data.action == "buy" ? "bg-green-400" : "bg-red-400"} px-2 py-px text-xs font-normal text-white`}
                            >
                              {data.action}
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Bitcoin vs US Dollar{" "}
                          </p>
                          <div className="flex items-center justify-between gap-x-2 text-xs">
                            <p>{data.created_at.toLocaleDateString()}</p>
                            <MoveRight />
                            <p>{data.trade_end.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex flex-col items-end justify-center">
                        <p className="font-semibold">
                          {Number(bitcoinPrice.price).toLocaleString("en-US", {
                            currency: "USD",
                            style: "currency",
                          })}
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
                  </AlertDialogTrigger>
                  <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
                    <div className="dark:hidden">
                      <BTCChartLight />
                    </div>
                    <div className="hidden dark:block">
                      <BTCChartDark />
                    </div>
                    <AlertDialogFooter className="w-fll flex items-center justify-between">
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "ETH/USD" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between border-l-2 ${data.action == "buy" ? "border-green-400" : "border-red-400"} p-3 transition-colors`}
                    >
                      {/* Left */}
                      <div className="flex items-center justify-start gap-x-2">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <TokenETH variant="mono" size={32} />
                        </div>
                        <div className="">
                          <p className="text-tight font-semibold">
                            ETH/USD{" "}
                            <span
                              className={`ml-2 rounded-sm capitalize ${data.action == "buy" ? "bg-green-400" : "bg-red-400"} px-2 py-px text-xs font-normal text-white`}
                            >
                              {data.action}
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Ethereum vs US Dollar{" "}
                          </p>
                          <div className="flex items-center justify-between gap-x-2 text-xs">
                            <p>{data.created_at.toLocaleDateString()}</p>
                            <MoveRight />
                            <p>{data.trade_end.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex flex-col items-end justify-center">
                        <p className="font-semibold">
                          {Number(ethereumPrice.price).toLocaleString("en-US", {
                            currency: "USD",
                            style: "currency",
                          })}
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
                  </AlertDialogTrigger>
                  <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
                    <div className="dark:hidden">
                      <ETHChartLight />
                    </div>
                    <div className="hidden dark:block">
                      <ETHChartDark />
                    </div>
                    <AlertDialogFooter className="w-fll flex items-center justify-between">
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "USDT/USD" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between border-l-2 ${data.action == "buy" ? "border-green-400" : "border-red-400"} p-3 transition-colors`}
                    >
                      {/* Left */}
                      <div className="flex items-center justify-start gap-x-2">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <TokenUSDT variant="mono" size={32} />
                        </div>
                        <div className="">
                          <p className="text-tight font-semibold">
                            USDT/USD{" "}
                            <span
                              className={`ml-2 rounded-sm capitalize ${data.action == "buy" ? "bg-green-400" : "bg-red-400"} px-2 py-px text-xs font-normal text-white`}
                            >
                              {data.action}
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Tether vs US Dollar{" "}
                          </p>
                          <div className="flex items-center justify-between gap-x-2 text-xs">
                            <p>{data.created_at.toLocaleDateString()}</p>
                            <MoveRight />
                            <p>{data.trade_end.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex flex-col items-end justify-center">
                        <p className="font-semibold">
                          {Number(usdtPrice.price).toLocaleString("en-US", {
                            currency: "USD",
                            style: "currency",
                          })}
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
                  </AlertDialogTrigger>
                  <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
                    <div className="dark:hidden">
                      <USDTChartLight />
                    </div>
                    <div className="hidden dark:block">
                      <USDTChartDark />
                    </div>
                    <AlertDialogFooter className="w-fll flex items-center justify-between">
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "XRP/USD" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between border-l-2 ${data.action == "buy" ? "border-green-400" : "border-red-400"} p-3 transition-colors`}
                    >
                      {/* Left */}
                      <div className="flex items-center justify-start gap-x-2">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <TokenXRP variant="mono" size={32} />
                        </div>
                        <div className="">
                          <p className="text-tight font-semibold">
                            XRP/USD{" "}
                            <span
                              className={`ml-2 rounded-sm capitalize ${data.action == "buy" ? "bg-green-400" : "bg-red-400"} px-2 py-px text-xs font-normal text-white`}
                            >
                              {data.action}
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            XRP vs US Dollar{" "}
                          </p>
                          <div className="flex items-center justify-between gap-x-2 text-xs">
                            <p>{data.created_at.toLocaleDateString()}</p>
                            <MoveRight />
                            <p>{data.trade_end.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex flex-col items-end justify-center">
                        <p className="font-semibold">
                          {Number(xrpPrice.price).toLocaleString("en-US", {
                            currency: "USD",
                            style: "currency",
                          })}
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
                  </AlertDialogTrigger>
                  <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
                    <div className="dark:hidden">
                      <XRPChartLight />
                    </div>
                    <div className="hidden dark:block">
                      <XRPChartDark />
                    </div>
                    <AlertDialogFooter className="w-fll flex items-center justify-between">
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : data.pair == "XAUT/USD" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div
                      className={`hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between border-l-2 ${data.action == "buy" ? "border-green-400" : "border-red-400"} p-3 transition-colors`}
                    >
                      {/* Left */}
                      <div className="flex items-center justify-start gap-x-2">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="25"
                            height="25"
                          >
                            <title>gold</title>
                            <path
                              d="M1 22L2.5 17H9.5L11 22H1M13 22L14.5 17H21.5L23 22H13M6 15L7.5 10H14.5L16 15H6M23 6.05L19.14 7.14L18.05 11L16.96 7.14L13.1 6.05L16.96 4.96L18.05 1.1L19.14 4.96L23 6.05Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="">
                          <p className="text-tight font-semibold">
                            XAUT/USD{" "}
                            <span
                              className={`ml-2 rounded-sm capitalize ${data.action == "buy" ? "bg-green-400" : "bg-red-400"} px-2 py-px text-xs font-normal text-white`}
                            >
                              {data.action}
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Gold vs Tether{" "}
                          </p>
                          <div className="flex items-center justify-between gap-x-2 text-xs">
                            <p>{data.created_at.toLocaleDateString()}</p>
                            <MoveRight />
                            <p>{data.trade_end.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex flex-col items-end justify-center">
                        <p className="font-semibold">
                          {Number(goldPrice.price).toLocaleString("en-US", {
                            currency: "USD",
                            style: "currency",
                          })}
                        </p>
                        <p
                          className={
                            goldPrice.change24h >= 0
                              ? "text-sm text-green-500 dark:text-green-300"
                              : "text-sm text-red-500 dark:text-red-300"
                          }
                        >
                          {goldPrice.change24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="h-[33rem] w-full overflow-scroll">
                    <div className="dark:hidden">
                      <XAUTChartLight />
                    </div>
                    <div className="hidden dark:block">
                      <XAUTChartDark />
                    </div>
                    <AlertDialogFooter className="w-fll flex items-center justify-between">
                      <AlertDialogCancel>Close</AlertDialogCancel>
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
