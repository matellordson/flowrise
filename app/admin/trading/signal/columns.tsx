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
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "pair",
    header: "Pair",
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

      return (
        <div className="flex justify-end gap-2">
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
