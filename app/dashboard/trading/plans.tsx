import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { sql } from "@/lib/sql";
import { DecimalsArrowRight, Sprout, TreeDeciduous, Trees } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TradingPlans() {
  const session = await auth();

  async function miniPlan() {
    "use server";
    await sql`INSERT into trading_accounts ("user", plan) VALUES (${session?.user?.email}, 'mini')`;
    redirect("/dashboard/trading");
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3">
      {/* mini */}
      <div className="h-fit w-[18.5rem] rounded-xl border p-3">
        <Sprout className="mb-1" />
        <p className="text-sm font-semibold">Mini plan</p>
        <p className="text-tight flex items-end gap-x-2 font-mono">
          <span className="text-2xl font-semibold">$100</span>
          <DecimalsArrowRight size={22} className="stroke-muted-foreground" />
          <span className="">$1,000</span>
        </p>
        <p className="text-muted-foreground pt-2 text-sm">
          Investment plan for new traders
        </p>
        <form action={miniPlan} className="mt-3">
          <Button
            type="submit"
            variant={"outline"}
            className="w-full"
            size={"sm"}
          >
            Select plan
          </Button>
        </form>
      </div>
      {/* Pro */}
      <div className="h-fit w-[18.5rem] rounded-xl border p-3">
        <TreeDeciduous className="mb-1" />
        <p className="text-sm font-semibold">Pro plan</p>
        <p className="text-tight flex items-end gap-x-2 font-mono">
          <span className="text-2xl font-semibold">$1,000</span>
          <DecimalsArrowRight size={22} className="stroke-muted-foreground" />
          <span className="">$10,000</span>
        </p>
        <p className="text-muted-foreground pt-2 text-sm">
          Investment plan for experienced traders
        </p>
        <form action="" className="mt-3">
          <Button type="submit" className="w-full" size={"sm"}>
            Select plan
          </Button>
        </form>
      </div>
      {/* Max */}
      <div className="h-fit w-[18.5rem] rounded-xl border p-3">
        <Trees className="mb-1" />
        <p className="text-sm font-semibold">Max plan</p>
        <p className="text-tight flex items-end gap-x-2 font-mono">
          <span className="text-2xl font-semibold">$10,00</span>
          <DecimalsArrowRight size={22} className="stroke-muted-foreground" />
          <span className="">$50,000</span>
        </p>
        <p className="text-muted-foreground pt-2 text-sm">
          Investment plan for expert traders
        </p>
        <form action="" className="mt-3">
          <Button
            type="submit"
            variant={"outline"}
            className="w-full"
            size={"sm"}
          >
            Select plan
          </Button>
        </form>
      </div>
    </div>
  );
}
