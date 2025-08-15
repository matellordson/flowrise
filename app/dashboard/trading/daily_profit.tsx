import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDown, OctagonAlert, TrendingUp, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/sql";
import { auth } from "@/auth";

interface dataType {
  id: string;
  user: string;
  amount: number;
  created_at: Date;
}

export default async function DailyProfit() {
  const session = await auth();
  const data =
    (await sql`SELECT * FROM daily_profit WHERE "user" = ${session?.user?.email} ORDER BY created_at DESC`) as dataType[];
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold tracking-tight">Daily Profits</p>
      {data && data.length > 0 ? (
        data.map((data) => (
          <div className="" key={data.id}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-x-2">
                <div className="bg-muted flex h-fit w-fit items-center justify-center rounded-full p-1">
                  <ArrowDown size={20} />
                </div>
                <div className="text-sm">
                  <p className="text-card-foreground w-[12rem] truncate lg:w-[20rem]">
                    Received daily Profit
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
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-20 flex h-full w-full flex-col items-center justify-center">
          <X size={25} /> <p>No Daily Profit History</p>
        </div>
      )}
    </div>
  );
}
