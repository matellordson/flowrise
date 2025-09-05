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
import { Eye } from "lucide-react";
import { sql } from "@/lib/sql";

export type Payment = {
  id: number;
  user: string;
  email: string;
  amount: number;
  payment_type: "bank" | "card"; // Removed saved_account type
  status: boolean;
  created_at: string;
  // Bank transfer fields
  account_holder_name?: string;
  iban?: string;
  swift_bic?: string;
  bank_name?: string;
  bank_address?: string;
  currency?: string;
  // Card payment fields
  card_holder?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
};

export const columns: ColumnDef<Payment>[] = [
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
      const payment = row.original;
      const currency = payment.currency || "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "payment_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("payment_type") as string;
      return (
        <Badge variant={type === "bank" ? "default" : "secondary"}>
          {type === "bank" ? "Bank Transfer" : "Card Payment"}
        </Badge>
      );
    },
  },
  {
    header: "Details",
    cell: ({ row }) => {
      const payment = row.original;

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
              <DialogTitle>Payment Details</DialogTitle>
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
                    <p className="font-medium">{payment.user}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Email
                    </label>
                    <p className="font-medium">{payment.email}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Amount
                    </label>
                    <p className="text-lg font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: payment.currency || "USD",
                      }).format(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-sm font-medium">
                      Payment Type
                    </label>
                    <br />
                    <Badge
                      variant={
                        payment.payment_type === "bank"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {payment.payment_type === "bank"
                        ? "Bank Transfer"
                        : "Card Payment"}
                    </Badge>
                  </div>
                  {payment.currency && (
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Currency
                      </label>
                      <p className="font-medium">{payment.currency}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Details */}
              {payment.payment_type === "bank" ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Bank Transfer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Account Holder
                      </label>
                      <p className="font-medium">
                        {payment.account_holder_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Bank Name
                      </label>
                      <p className="font-medium">{payment.bank_name}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        IBAN
                      </label>
                      <p className="font-mono text-sm">{payment.iban}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        SWIFT/BIC
                      </label>
                      <p className="font-mono text-sm">{payment.swift_bic}</p>
                    </div>
                    {payment.bank_address && (
                      <div className="col-span-2">
                        <label className="text-muted-foreground text-sm font-medium">
                          Bank Address
                        </label>
                        <p className="text-sm">{payment.bank_address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Card Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Cardholder Name
                      </label>
                      <p className="font-medium">{payment.card_holder}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Card Number
                      </label>
                      <p className="font-mono">{payment.card_number}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        Expiry Date
                      </label>
                      <p className="font-mono">{payment.expiry_date}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm font-medium">
                        CVV
                      </label>
                      <p className="font-mono">{payment.cvv}</p>
                    </div>
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
    header: "Quick Info",
    cell: ({ row }) => {
      const payment = row.original;
      if (payment.payment_type === "bank") {
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {payment.account_holder_name}
            </div>
            <div className="text-muted-foreground text-xs">
              {payment.bank_name}
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{payment.card_holder}</div>
          <div className="text-muted-foreground text-xs">
            **** {payment.card_number?.slice(-4)}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      const handleDone = async () => {
        try {
          if (payment.payment_type === "bank") {
            await sql`
              UPDATE bank_transfer 
              SET status = true 
              WHERE id = ${payment.id}
            `;
          } else {
            await sql`
              UPDATE card_transfer 
              SET status = true 
              WHERE id = ${payment.id}
            `;
          }

          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      };

      return (
        <Button variant="outline" size="sm" onClick={handleDone}>
          Done
        </Button>
      );
    },
  },
];
