"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sql } from "@/lib/sql";
import { useState } from "react";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  user: string;
  plan: string;
  balance: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-center">Balance</div>,
    cell: ({ row }) => {
      const balance = Number.parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);
      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
      const [amount, setAmount] = useState("");
      const [isLoading, setIsLoading] = useState(false);

      const handleAddBalance = async () => {
        if (!amount || isNaN(Number(amount))) {
          toast("Please enter a valid number");
          return;
        }
        setIsLoading(true);
        try {
          const currentDate = new Date().toISOString();

          // Update trading account balance
          await sql`
            UPDATE trading_accounts 
            SET balance = balance + ${Number(amount)}
            WHERE id = ${payment.id}
          `;

          // Insert daily profit record
          await sql`
            INSERT INTO daily_profit ("user", amount, created_at)
            VALUES (${payment.user}, ${Number(amount)}, ${currentDate})
          `;

          toast(
            `Added $${amount} to ${payment.user}'s account and recorded daily profit`,
          );
          setIsAddBalanceOpen(false);
          setAmount("");
          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          console.error("Error updating balance and daily profit:", error);
          toast("Failed to update balance and daily profit");
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex justify-end">
          <Dialog open={isAddBalanceOpen} onOpenChange={setIsAddBalanceOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent"
              >
                Add Balance
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Balance</DialogTitle>
                <DialogDescription>
                  Add amount to {payment.user}'s account and record daily profit
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter amount to add"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Current Balance:
                    </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(payment.balance)}
                    </span>
                  </div>
                  {amount && !isNaN(Number(amount)) && (
                    <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm">
                      <span className="text-muted-foreground">
                        New Balance:
                      </span>
                      <span className="font-medium text-green-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(payment.balance + Number(amount))}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-muted rounded-lg border p-3">
                  <p className="text-sm">
                    <strong>Note:</strong> This will update the account balance
                    and create a daily profit record.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddBalanceOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddBalance}
                    disabled={isLoading || !amount}
                  >
                    {isLoading ? "Processing..." : `Add $${amount || "0"}`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
