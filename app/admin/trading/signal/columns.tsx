"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { sql } from "@/lib/sql";
import { redirect } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  pair: string;
  created_at: string;
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
            <Button variant="outline" size="sm" className="gap-2">
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
