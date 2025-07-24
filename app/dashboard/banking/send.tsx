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
import { ArrowUp, OctagonAlert } from "lucide-react";
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
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const formSchema = z.object({
  bankName: z
    .string()
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name cannot exceed 100 characters"),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .max(17, "Account number cannot exceed 17 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  routingNumber: z
    .string()
    .length(9, "Routing number must be exactly 9 digits")
    .regex(/^\d+$/, "Routing number must contain only digits"),
  amount: z
    .number()
    .min(1, "Amount must be at least $1")
    .max(500000, "Amount cannot exceed $500,000"),
});

export default function SendMoney() {
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      amount: 1,
    },
  });

  const { data: session } = useSession();

  // Fetch user balance
  useEffect(() => {
    async function fetchBalance() {
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await sql`
          SELECT balance FROM bank
          WHERE "user" = ${session.user.email}
          LIMIT 1
        `;

        console.log("Balance query result:", result); // Debug log

        if (result && result.length > 0 && result[0]) {
          const balance = Number(result[0].balance) || 0;
          setUserBalance(balance);
        } else {
          // If no record exists, create one with 0 balance
          await sql`
            INSERT INTO bank ("user", email, balance) 
            VALUES (${session.user.name}, ${session.user.email}, 0)
            ON CONFLICT ("user") DO NOTHING
          `;
          setUserBalance(0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("Failed to fetch account balance");
        setUserBalance(0); // Set to 0 on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [session]);

  // Add custom validation for amount vs balance
  const validateAmount = (amount: number) => {
    if (amount > userBalance) {
      return "Amount cannot exceed your available balance";
    }
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.amount > userBalance) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      // Check balance again before processing
      const balanceCheck = await sql`
        SELECT balance FROM bank
        WHERE "user" = ${session?.user?.email}
        LIMIT 1
      `;

      const currentBalance = balanceCheck[0]?.balance || 0;

      if (values.amount > currentBalance) {
        toast.error("Insufficient funds - balance may have changed");
        setUserBalance(currentBalance);
        return;
      }

      // Insert the send transaction
      await sql`
        INSERT INTO bank_transfer (
          "user", 
          email, 
          bank_name, 
          account_number, 
          routing_number, 
          amount, 
          status,
          created_at
        ) VALUES (
          ${session?.user?.name}, 
          ${session?.user?.email}, 
          ${values.bankName},
          ${values.accountNumber},
          ${values.routingNumber},
          ${values.amount},
          false,
          NOW()
        )
      `;

      // Update user balance
      const updateResult = await sql`
        UPDATE bank 
        SET balance = balance - ${values.amount}
        WHERE "user" = ${session?.user?.email}
        RETURNING balance
      `;

      // Update local balance state
      if (updateResult[0]?.balance !== undefined) {
        setUserBalance(Number(updateResult[0].balance));
      }

      toast.success("Transfer initiated successfully");
      form.reset({
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        amount: 100,
      });

      // Use window.location instead of redirect for client component
      window.location.href = "/dashboard/banking";
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Failed to process transfer");
    }
  }

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled>
            <ArrowUp className="h-4 w-4" />
            Send Money
          </Button>
        </DialogTrigger>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUp className="h-4 w-4" />
          Send Money
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Transfer funds to another bank account. Available balance: $
            {userBalance.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <OctagonAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Transfer Instructions
          </AlertTitle>
          <AlertDescription>
            Please double-check all account details before submitting. Transfers
            are typically processed within 1-3 business days.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter bank name" />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the receiving bank.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter account number"
                      maxLength={17}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the recipient's account number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter routing number"
                      maxLength={9}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the 9-digit routing number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      min="1"
                      max={userBalance}
                      step="0.01"
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value);
                        field.onChange(value);

                        // Custom validation
                        if (value > userBalance) {
                          form.setError("amount", {
                            message:
                              "Amount cannot exceed your available balance",
                          });
                        } else {
                          form.clearErrors("amount");
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount to send (Max: $
                    {userBalance.toLocaleString()}).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.watch("amount") > userBalance}
            >
              Send Funds
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
