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
        console.log("Fetching balance for user:", session.user.email);

        const result = await sql`
          SELECT balance FROM bank
          WHERE "user" = ${session.user.email}
          LIMIT 1
        `;

        console.log("Raw query result:", result);
        console.log("Result type:", typeof result);
        console.log("Result length:", result?.length);
        console.log("First item:", result?.[0]);

        // Handle different possible result formats
        let balance = 0;

        if (Array.isArray(result) && result.length > 0) {
          const firstRow = result[0];
          if (
            firstRow &&
            typeof firstRow === "object" &&
            "balance" in firstRow
          ) {
            balance = Number(firstRow.balance) || 0;
          }
        } else if (
          result &&
          typeof result === "object" &&
          "balance" in result
        ) {
          // Some SQL libraries return the first row directly
          balance = Number(result.balance) || 0;
        }

        console.log("Parsed balance:", balance);
        setUserBalance(balance);

        // If balance is still 0, try to create a user record
        if (balance === 0) {
          try {
            await sql`
              INSERT INTO bank ("user", email, balance) 
              VALUES (${session.user.name || session.user.email}, ${session.user.email}, 0)
              ON CONFLICT ("user") DO NOTHING
            `;
            console.log("Created user record with 0 balance");
          } catch (insertError) {
            console.log(
              "Insert failed (user might already exist):",
              insertError,
            );
          }
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("Failed to fetch account balance");
        setUserBalance(0);
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

      console.log("Balance check result:", balanceCheck);

      let currentBalance = 0;
      if (
        Array.isArray(balanceCheck) &&
        balanceCheck.length > 0 &&
        balanceCheck[0]
      ) {
        currentBalance = Number(balanceCheck[0].balance) || 0;
      }

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
          ${session?.user?.name || session?.user?.email}, 
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

      console.log("Update result:", updateResult);

      // Update local balance state
      if (
        Array.isArray(updateResult) &&
        updateResult.length > 0 &&
        updateResult[0]
      ) {
        const newBalance = Number(updateResult[0].balance) || 0;
        setUserBalance(newBalance);
      } else {
        // Fallback: refetch balance
        const refetchResult = await sql`
          SELECT balance FROM bank
          WHERE "user" = ${session?.user?.email}
          LIMIT 1
        `;
        if (
          Array.isArray(refetchResult) &&
          refetchResult.length > 0 &&
          refetchResult[0]
        ) {
          setUserBalance(Number(refetchResult[0].balance) || 0);
        }
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
