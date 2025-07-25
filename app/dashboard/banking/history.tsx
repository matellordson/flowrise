import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/sql";
import {
  BrushIcon as BrushCleaning,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  PackageOpen,
  X,
} from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

type dataType = {
  id: string;
  user: string;
  amount: number;
  type: string;
  created_at: string;
};

async function getTransactionHistory() {
  noStore();
  const session = await auth();

  try {
    if (!session?.user?.name) {
      return [];
    }

    const data = (await sql`
      SELECT * FROM bank_history 
      WHERE "user" = ${session.user.name} 
      ORDER BY created_at DESC
    `) as dataType[];

    return data || [];
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return [];
  }
}

export default async function History() {
  const data = await getTransactionHistory();
  const session = await auth();

  return (
    <div className="bg-card text-card-foreground h-[21rem] w-full overflow-hidden overflow-y-scroll rounded-xl p-3 lg:h-screen">
      <p className="flex items-center gap-x-1 text-sm font-semibold tracking-wide">
        Transactions
      </p>
      <p className="text-muted-foreground pb-2 text-xs font-normal">
        Showing successfull complete transaction
      </p>
      <div className="space-y-2">
        {data && data.length > 0 ? (
          data.map((data) => (
            <div className="" key={data.id}>
              {data.type == "deposit" ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                      <ArrowDown size={20} />
                    </div>
                    <div className="text-sm">
                      <p className="text-card-foreground w-[12rem] truncate lg:w-[20rem]">
                        Recieved from {data.user}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(data.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-right font-mono font-semibold text-green-500 dark:text-green-300">
                      +
                      {Number(data.amount).toLocaleString("en-US", {
                        currency: "USD",
                        style: "currency",
                      })}
                    </p>
                    <Badge variant={"default"}>Successful</Badge>
                  </div>
                </div>
              ) : data.type == "send" ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                      <ArrowUp size={20} />
                    </div>
                    <div className="text-sm">
                      <p className="text-card-foreground w-[12rem] truncate lg:w-[20rem]">
                        Transfer to {data.user}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(data.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-right font-mono font-semibold text-red-500 dark:text-red-300">
                      -
                      {Number(data.amount).toLocaleString("en-US", {
                        currency: "USD",
                        style: "currency",
                      })}
                    </p>
                    <Badge variant={"default"}>Successful</Badge>
                  </div>
                </div>
              ) : data.type == "exchange" ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                      <RefreshCw size={20} />
                    </div>
                    <div className="text-sm">
                      <p className="text-card-foreground w-[12rem] truncate lg:w-[20rem]">
                        Exchange from crypto
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(data.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <p className="text-right font-mono font-semibold text-green-500 dark:text-green-300">
                      +
                      {Number(data.amount).toLocaleString("en-US", {
                        currency: "USD",
                        style: "currency",
                      })}
                    </p>
                    <Badge variant={"default"}>Successful</Badge>
                  </div>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="mt-20 flex h-full w-full flex-col items-center justify-center">
            <X size={25} /> <p>No Transaction History</p>
          </div>
        )}
      </div>
    </div>
  );
}
