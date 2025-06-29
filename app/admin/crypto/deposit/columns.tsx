"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { sql } from "@/lib/sql";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  user_email: string;
  amount: string;
  coin: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "user_email",
    header: "User",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "coin",
    header: "Coin",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      const router = useRouter();

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              Fund
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will fund users wallet
                address with the amount of coin they submitted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await sql`UPDATE crypto_deposit SET funded = true WHERE id = ${payment.id}`;
                  await sql`UPDATE crypto SET bitcoin = ${payment.amount} WHERE user_email = ${payment.user_email}`;
                  router.refresh();
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
