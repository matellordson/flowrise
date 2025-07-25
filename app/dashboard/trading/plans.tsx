"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

import {
  Form, // This Form should come from shadcn/ui
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  ArrowRightIcon as DecimalsArrowRight,
  OctagonAlert,
  Sprout,
  TreeDeciduous,
  Trees,
} from "lucide-react";

// Assuming these imports are correct and components/utilities exist
import BankDepositAccounts from "../banking/deposit-accounts";
import { sql } from "@/lib/sql";

const formSchema = z.object({
  amount: z
    .number()
    .min(100, "Amount must be at least $100")
    .max(500000, "Amount cannot exceed $500,000"),
});

export default function TradingPlans() {
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
    },
  });

  async function miniPlan(values: z.infer<typeof formSchema>) {
    try {
      // Ensure session?.user?.email is not null before using it
      if (!session?.user?.email) {
        toast.error("User email not found. Please log in again.");
        return;
      }
      await sql`INSERT into trading_deposit ("user", plan, amount) VALUES (${session.user.email}, 'mini', ${values.amount})`;
      toast("Please proceed to making deposit");
      form.reset();
      router.push("/dashboard/trading"); // Use router.push for client-side navigation
    } catch (error) {
      console.error("Failed to create trading plan:", error);
      toast.error("Failed to select plan. Please try again.");
    }
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button" // Changed to type="button" to prevent form submission
              variant={"outline"}
              className="mt-3 w-full"
              size={"sm"}
            >
              Select plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Fund your account</DialogTitle>
              <DialogDescription>
                Select a deposit account and enter the amount you want to
                deposit.
              </DialogDescription>
            </DialogHeader>
            <Alert>
              <OctagonAlert className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                Deposit Instructions
              </AlertTitle>
              <AlertDescription>
                Please select any of the provided deposit accounts and pay then
                come back to fill the amount form. Your trading account will be
                funded within 24 hours of payment confirmation.
              </AlertDescription>
            </Alert>
            <BankDepositAccounts />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(miniPlan)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter amount"
                          min="100"
                          max="500000"
                          step="0.01"
                          onChange={(e) =>
                            field.onChange(Number.parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount you have deposited.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Sent
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
