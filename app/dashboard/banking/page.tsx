import DepositMoney from "./deposit";
import ExchangeMoney from "./exchange";
import SendMoney from "./send";
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";
import BankHistory from "./history";

interface dataType {
  balance: number;
}

export default async function Banking() {
  const session = await auth();

  async function getBalance() {
    const data =
      (await sql`SELECT balance FROM bank WHERE "user" = ${session?.user?.email} LIMIT 1`) as dataType[];
    return data;
  }

  const balance = await getBalance();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
      <div className="bg-card text-card-forground w-full rounded-xl p-5 lg:h-screen">
        <p className="pb-4 text-center font-mono text-3xl font-semibold lg:text-4xl">
          {Number(balance[0].balance | 0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <div className="flex w-full items-center justify-between gap-x-2">
          <SendMoney />
          <DepositMoney />
          <ExchangeMoney />
        </div>
      </div>
      <BankHistory />
    </div>
  );
}
