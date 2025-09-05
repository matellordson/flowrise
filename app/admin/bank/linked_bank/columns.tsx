"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type BankAccount = {
  id: number;
  user_email: string;
  account_name: string;
  account_holder_name: string;
  iban: string;
  swift_bic: string;
  bank_name: string;
  bank_address?: string;
  currency: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<BankAccount>[] = [
  {
    accessorKey: "account_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{account.account_name}</div>
          <div className="text-muted-foreground text-sm">
            {account.account_holder_name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user_email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm">{row.getValue("user_email")}</div>
      );
    },
  },
  {
    accessorKey: "bank_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{account.bank_name}</div>
          <div className="text-muted-foreground text-sm">
            {account.iban.slice(0, 4)}****{account.iban.slice(-4)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono">
          {row.getValue("currency")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_default",
    header: "Status",
    cell: ({ row }) => {
      const isDefault = row.getValue("is_default") as boolean;
      return (
        <Badge variant={isDefault ? "default" : "secondary"}>
          {isDefault ? "Default" : "Regular"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const account = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bank Account Details</DialogTitle>
              <DialogDescription>
                Complete information for {account.account_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Account Name
                  </label>
                  <p className="text-sm">{account.account_name}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Account Holder
                  </label>
                  <p className="text-sm">{account.account_holder_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    User Email
                  </label>
                  <p className="font-mono text-sm">{account.user_email}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Currency
                  </label>
                  <p className="text-sm">{account.currency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    IBAN
                  </label>
                  <p className="font-mono text-sm">{account.iban}</p>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    SWIFT/BIC
                  </label>
                  <p className="font-mono text-sm">{account.swift_bic}</p>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Bank Name
                </label>
                <p className="text-sm">{account.bank_name}</p>
              </div>

              {account.bank_address && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Bank Address
                  </label>
                  <p className="text-sm">{account.bank_address}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Status
                  </label>
                  <Badge
                    variant={account.is_default ? "default" : "secondary"}
                    className="w-fit"
                  >
                    {account.is_default ? "Default Account" : "Regular Account"}
                  </Badge>
                </div>
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Created
                  </label>
                  <p className="text-sm">
                    {new Date(account.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
