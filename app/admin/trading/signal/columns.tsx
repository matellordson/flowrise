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
  amount: number;
  pair: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "pair",
    header: "Pair",
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
                await sql`UPDATE trading_send SET status = true WHERE id = ${payment.id}`;

                // await sql`INSERT INTO bank_history ("user", amount, type) VALUES (${payment.user}, ${payment.amount}, ${"send"})`;

                redirect("/admin/bank/deposit");
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
