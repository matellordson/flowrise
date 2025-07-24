"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateBalance } from "./action";
import { useActionState, useState } from "react";
import { toast } from "sonner";

// This type is used to define the shape of our data.
export type Payment = {
  id: string;
  user: string;
  balance: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => {
      const balance = Number.parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      const [state, formAction, isPending] = useActionState(
        updateBalance,
        null,
      );
      const [open, setOpen] = useState(false);

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="float-right bg-transparent">
              Update
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form action={formAction}>
              <DialogHeader>
                <DialogTitle>Update Balance</DialogTitle>
                <DialogDescription>
                  Make changes to user&apos;s balance in their bank section.
                  Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    defaultValue={payment.balance}
                    required
                  />
                  <Input
                    id="id"
                    name="id"
                    type="hidden"
                    defaultValue={payment.id}
                  />
                </div>
                {state?.error && (
                  <div className="text-sm text-red-500 dark:text-red-300">
                    {state.error}
                  </div>
                )}
                {state?.success && (
                  <div className="text-sm text-green-500 dark:text-green-300"></div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isPending}
                  onClick={() => {
                    if (state?.success) {
                      setOpen(false);
                    }
                  }}
                >
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
