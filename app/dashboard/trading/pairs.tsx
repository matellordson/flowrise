import { Badge } from "@/components/ui/badge";
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
import { auth } from "@/auth";
import { X } from "lucide-react";
import { TokenBTC, TokenETH, TokenUSDT, TokenXRP } from "@web3icons/react";
import { redirect } from "next/navigation";
import { CryptoChart } from "@/components/crypto-chart";

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

export default async function Pairs({ accountID }: { accountID: string }) {
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

  const getSignal = (await sql`SELECT id, pair, amount, created_at, users
  FROM signal 
  WHERE open = true 
  AND (users IS NULL OR NOT (users @> ARRAY[${session?.user?.email}]))
  ORDER BY created_at DESC;`) as dataType[];

  const coinConfig = {
    "BTC/USD": {
      coinId: "bitcoin",
      coinName: "Bitcoin",
      icon: <TokenBTC variant="mono" size={32} />,
      description: "Bitcoin vs US Dollar",
      price: bitcoinPrice,
    },
    "ETH/USD": {
      coinId: "ethereum",
      coinName: "Ethereum",
      icon: <TokenETH variant="mono" size={32} />,
      description: "Ethereum vs US Dollar",
      price: ethereumPrice,
    },
    "USDT/USD": {
      coinId: "tether",
      coinName: "Tether",
      icon: <TokenUSDT variant="mono" size={32} />,
      description: "Tether vs US Dollar",
      price: usdtPrice,
    },
    "XRP/USD": {
      coinId: "ripple",
      coinName: "XRP",
      icon: <TokenXRP variant="mono" size={32} />,
      description: "XRP vs US Dollar",
      price: xrpPrice,
    },
  };

  return (
    <div className="">
      <div className="mb-3 flex w-full items-center justify-between">
        <p className="text-sm font-semibold tracking-tight">
          Open orders{" "}
          <Badge variant={"outline"} className="ml-1 font-semibold">
            {getSignal.length}
          </Badge>
        </p>
      </div>
      {getSignal.length < 1 ? (
        <div className="">
          <div className="flex h-[15rem] flex-col items-center justify-center">
            <X size={25} />
            <p>No open orders</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 overflow-scroll">
          {getSignal.map((data) => {
            const config = coinConfig[data.pair as keyof typeof coinConfig];

            if (!config) return null;

            return (
              <div key={data.id}>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors">
                      {/* Left */}
                      <div className="flex items-center justify-start gap-x-2">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          {config.icon}
                        </div>
                        <div className="">
                          <p className="text-tight font-semibold">
                            {data.pair}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex flex-col items-end justify-center">
                        <p className="font-semibold">
                          ${Number(config.price.price).toLocaleString()}
                        </p>
                        <p
                          className={
                            config.price.change24h >= 0
                              ? "text-sm text-green-500 dark:text-green-300"
                              : "text-sm text-red-500 dark:text-red-300"
                          }
                        >
                          {config.price.change24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-h-[90vh] max-w-full overflow-y-auto sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                          {config.icon}
                        </div>
                        Execute Trade - {data.pair}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Review the chart below and confirm if you want to
                        execute this trade. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4">
                      <CryptoChart
                        coinId={config.coinId}
                        coinName={config.coinName}
                        days={7}
                      />
                    </div>

                    <div className="bg-muted/30 grid grid-cols-2 gap-4 rounded-lg p-4">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Current Price
                        </p>
                        <p className="text-lg font-semibold">
                          ${Number(config.price.price).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">
                          24h Change
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            config.price.change24h >= 0
                              ? "text-green-500 dark:text-green-300"
                              : "text-red-500 dark:text-red-300"
                          }`}
                        >
                          {config.price.change24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          "use server";
                          await sql`UPDATE signal SET users = users || ARRAY[${session?.user?.email}] WHERE id = ${data.id};`;
                          redirect("/dashboard/trading");
                        }}
                      >
                        Execute Trade
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
