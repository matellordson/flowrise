"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sql } from "@/lib/sql";
import { redirect } from "next/navigation";

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
    header: "Balance",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <form action="">
          <Button
            size={"sm"}
            variant={"outline"}
            formAction={async () => {
              try {
                await sql`UPDATE trading_deposit SET done = true WHERE id = ${payment.id}`;

                await sql`INSERT trading_account ("user", plan, balance) VALUES (${payment.user}, ${payment.plan})`;

                // await sql`UPDATE bank SET balance = balance + ${payment.amount} WHERE "user" = ${payment.email}`;

                // await sql`INSERT INTO bank_history ("user", amount, type) VALUES (${payment.user}, ${payment.amount}, ${"deposit"})`;

                redirect("/admin/trading/deposit");
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Done
          </Button>
        </form>
      );
    },
  },
];
