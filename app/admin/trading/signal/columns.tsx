"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Users, DollarSign } from "lucide-react";
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
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  pair: string;
  created_at: string;
  trade_end: string;
  users: string[]; // Array of user names/emails as strings
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "pair",
    header: "Pair",
  },
  {
    accessorKey: "users",
    header: "Users",
    cell: ({ row }) => {
      const users = row.getValue("users") as string[];
      const userCount = users?.length || 0;
      if (userCount === 0) {
        return <div className="text-muted-foreground">No users</div>;
      }
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Users className="h-4 w-4" />
              {userCount} {userCount === 1 ? "user" : "users"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Signal Users</DialogTitle>
              <DialogDescription>
                Users associated with this signal ({userCount} total)
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    <span className="text-primary text-sm font-medium">
                      {user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-right">Created</div>,
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      const date = new Date(dateValue as string);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "trade_end",
    header: () => <div className="text-right">Trade End</div>,
    cell: ({ row }) => {
      const dateValue = row.getValue("trade_end");
      const date = new Date(dateValue as string);
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
      return <div className="text-right font-medium">{formattedDate}</div>;
    },
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

          // Update balance for all users in the signal and insert daily profit records
          for (const user of payment.users) {
            // Update trading account balance
            await sql`
              UPDATE trading_accounts 
              SET balance = balance + ${Number(amount)}
              WHERE "user" = ${user}
            `;

            // Insert daily profit record
            await sql`
              INSERT INTO daily_profit ("user", amount, created_at)
              VALUES (${user}, ${Number(amount)}, ${currentDate})
            `;
          }

          toast(
            `Added $${amount} to ${payment.users.length} user accounts and recorded daily profits`,
          );
          setIsAddBalanceOpen(false);
          setAmount("");
          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          console.error("Error updating balances and daily profits:", error);
          toast("Failed to update user balances and daily profits");
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex justify-end gap-2">
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
                <DialogTitle>Add Balance to Users</DialogTitle>
                <DialogDescription>
                  Add amount to all {payment.users?.length} users in this signal
                  and record daily profits
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
                  <p className="mb-2 text-sm font-medium">
                    Users to be updated:
                  </p>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {payment.users?.map((user, index) => (
                      <div
                        key={index}
                        className="text-muted-foreground text-sm"
                      >
                        • {user}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-muted rounded-lg border p-3">
                  <p className="text-sm">
                    <strong>Note:</strong> This will update account balances and
                    create daily profit records for all users.
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
          <form action="" className="">
            <Button
              size={"sm"}
              variant={"outline"}
              formAction={async () => {
                try {
                  await sql`DELETE FROM signal WHERE id = ${payment.id}`;
                  redirect("/admin/bank/deposit");
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Close signal
            </Button>
          </form>
        </div>
      );
    },
  },
];
