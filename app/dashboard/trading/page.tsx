import { sql } from "@/lib/sql";
import TradingPlans from "./plans";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <p>you have plan </p>
      )}
    </div>
  );
}
