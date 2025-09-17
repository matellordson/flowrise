import DepositMoney from "./deposit";
import ExchangeMoney from "./exchange";
import SendMoney from "./send";
import { sql } from "@/lib/sql";
import { auth } from "@/auth";
import BankHistory from "./history";
import Image from "next/image";
import UserDetailsForm from "./user-details";

interface dataType {
  balance: number;
}

export default async function Banking() {
  const session = await auth();

  async function getBalance() {
    try {
      if (!session?.user?.email) {
        return [{ balance: 0 }];
      }

      const data = (await sql`
        SELECT balance FROM bank 
        WHERE "user" = ${session.user.email} 
        LIMIT 1
      `) as dataType[];

      return data;
    } catch (error) {
      console.error("Error fetching balance:", error);
      // Return default balance on error
      return [{ balance: 0 }];
    }
  }

  const balance = await getBalance();

  // Additional safety check
  const currentBalance = balance?.[0]?.balance ?? 0;

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
      <div className="bg-card text-card-forground w-full rounded-xl lg:h-screen lg:px-5">
        <p className="py-5 text-center font-mono text-3xl font-semibold lg:text-4xl">
          {Number(currentBalance).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <div
          className="flex w-full flex-wrap items-center justify-center"
          style={{ gap: "12px" }}
        >
          <SendMoney />
          <DepositMoney />
          <ExchangeMoney />
          <UserDetailsForm />
        </div>

        <div className="m-10 mx-auto mt-10 h-[16rem] w-full rounded-xl border">
          <div className="h-[55%] w-full">
            <Image
              src={"/exchange.png"}
              alt="banner"
              height={1000}
              width={1000}
              className="h-full w-full rounded-t-xl object-cover"
            />
          </div>
          <div className="h-[35%] w-full rounded-b-xl border border-t p-2">
            <p className="text-sm lg:text-base">Crypto to Cash, Instantly</p>
            <p className="text-muted-foreground text-xs leading-5 lg:text-sm lg:leading-6">
              Easily convert your crypto into cash and withdraw directly to your
              bank account. No delays, no hassle — just fast, secure access to
              your money whenever you need it.
            </p>
          </div>
        </div>
      </div>
      <BankHistory />
    </div>
  );
}
