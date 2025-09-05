"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle } from "lucide-react";
import { sql } from "@/lib/sql";

export type SendRequest = {
  id: number;
  user: string;
  email: string;
  amount: number;
  status: boolean;
  created_at: string;
  currency: string;
  saved_bank_account_id: number | null;
  account_name: string | null;
  account_holder_name: string | null;
  bank_name: string | null;
  iban: string | null;
  swift_bic: string | null;
  bank_address: string | null;
};

export const columns: ColumnDef<SendRequest>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const request = row.original;
      const currency = request.currency || "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      return (
        <Badge variant={status ? "default" : "secondary"}>
          {status ? "Completed" : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString();
    },
  },
  {
    header: "Account Details",
    cell: ({ row }) => {
      const request = row.original;
      if (request.saved_bank_account_id) {
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{request.account_name}</div>
            <div className="text-muted-foreground text-xs">
              {request.bank_name}
            </div>
          </div>
        );
      }
      return (
        <div className="text-muted-foreground text-sm">Direct Transfer</div>
      );
    },
  },
  {
    header: "Details",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-scroll">
            <DialogHeader>
              <DialogTitle>Send Request Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              {/* User Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Name
                    </label>
                    <p className="font-medium">{request.user}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Email
                    </label>
                    <p className="font-medium">{request.email}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Transfer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Transfer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Amount
                    </label>
                    <p className="text-lg font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: request.currency || "USD",
                      }).format(request.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Status
                    </label>
                    <br />
                    <Badge variant={request.status ? "default" : "secondary"}>
                      {request.status ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Currency
                    </label>
                    <p className="font-medium">{request.currency}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Date Created
                    </label>
                    <p className="font-medium">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Account Details */}
              {request.saved_bank_account_id && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Bank Account Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Account Name
                      </label>
                      <p className="font-medium">{request.account_name}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Account Holder
                      </label>
                      <p className="font-medium">
                        {request.account_holder_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Bank Name
                      </label>
                      <p className="font-medium">{request.bank_name}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        IBAN
                      </label>
                      <p className="font-mono text-sm">{request.iban}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        SWIFT/BIC
                      </label>
                      <p className="font-mono text-sm">{request.swift_bic}</p>
                    </div>
                    {request.bank_address && (
                      <div className="col-span-2">
                        <label className="text-muted-foreground text-sm font-medium">
                          Bank Address
                        </label>
                        <p className="text-sm">{request.bank_address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

      const handleComplete = async () => {
        try {
          await sql`
            UPDATE send_requests 
            SET status = true 
            WHERE id = ${request.id}
          `;
          window.location.reload();
        } catch (error) {
          console.error("Error updating request status:", error);
        }
      };

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleComplete}
          disabled={request.status}
        >
          {request.status ? "Completed" : "Done"}
        </Button>
      );
    },
  },
];
