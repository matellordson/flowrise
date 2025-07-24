"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowDownIcon as BanknoteArrowDown,
  OctagonAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import BankDepositAccounts from "./deposit-accounts";
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const formSchema = z.object({
  amount: z
    .number()
    .min(100, "Amount must be at least $100")
    .max(500000, "Amount cannot exceed $500,000"),
});

export default function DepositMoney() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
    },
  });

  const { data: session } = useSession();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sql`INSERT INTO bank_deposit ("user" ,email, amount) VALUES (${session?.user?.name}, ${session?.user?.email}, ${values.amount})`;
      toast("Please proceed to making deposit");
      redirect("/dashboard/banking");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowDown className="h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fund your account</DialogTitle>
          <DialogDescription>
            Select a deposit account and enter the amount you want to deposit.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <OctagonAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Deposit Instructions
          </AlertTitle>
          <AlertDescription>
            Please select any of the provided deposit accounts. Your banking
            account will be funded within 24 hours of payment confirmation.
          </AlertDescription>
        </Alert>

        <BankDepositAccounts />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    Enter the amount you want to deposit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Deposit Funds
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
