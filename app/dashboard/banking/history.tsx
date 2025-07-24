import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/sql";
import { ArrowDown, ArrowUp, BrushCleaning, RefreshCw } from "lucide-react";

interface dataType {
  id: string;
  user: string;
  amount: string;
  type: string;
  created_at: string;
}

export default async function BankHistory() {
  const session = await auth();
  const data =
    (await sql`SELECT * FROM bank_history WHERE "user" = ${session?.user?.name} ORDER BY created_at DESC`) as dataType[];
  return (
    <div className="bg-card text-card-foreground h-[18rem] w-full rounded-xl p-3 lg:h-screen">
      <p className="flex items-center gap-x-1 text-sm font-semibold tracking-wide">
        Transactions
      </p>
      <p className="text-muted-foreground pb-2 text-xs font-normal">
        Showing successfull complete transaction
      </p>
      <div className="space-y-2">
        {data.map((data) => (
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
                      Jul 21st, 17:55:42
                    </p>
                  </div>
                </div>

                <div className="">
                  <p className="text-right font-mono font-semibold">+$1,000</p>
                  <Badge variant={"default"}>Successful</Badge>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex-col items-center justify-center">
                <BrushCleaning size={25} />
                <p>No Transaction History</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
