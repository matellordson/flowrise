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
  created_at: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "pair",
    header: "Pair",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-right">Created</div>,
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      const date = new Date(dateValue as string); // Cast to string if it might be a Date object
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      }).format(date);

      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <form action="" className="float-right">
          <Button
            size={"sm"}
            variant={"outline"}
            formAction={async () => {
              try {
                await sql`UPDATE signal SET open = false WHERE id = ${payment.id}`;

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
      );
    },
  },
];
