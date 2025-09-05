"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sql } from "@/lib/sql";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BankAccount {
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
}

export default function BankAccountsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchBankAccounts() {
      try {
        console.log("[v0] Fetching all bank accounts...");

        const accounts = (await sql`
          SELECT 
            id,
            user_email,
            account_name,
            account_holder_name,
            iban,
            swift_bic,
            bank_name,
            bank_address,
            currency,
            is_default,
            created_at,
            updated_at
          FROM saved_bank_accounts
          ORDER BY created_at DESC
        `) as BankAccount[];

        console.log("[v0] Fetched bank accounts:", accounts);
        setBankAccounts(accounts);
      } catch (error) {
        console.error("[v0] Error fetching bank accounts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBankAccounts();
  }, []);

  const totalAccounts = bankAccounts.length;
  const uniqueUsers = new Set(bankAccounts.map((account) => account.user_email))
    .size;
  const defaultAccounts = bankAccounts.filter(
    (account) => account.is_default,
  ).length;

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bank Accounts Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all linked bank accounts and their associated users
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAccounts}</div>
              <p className="text-muted-foreground text-xs">
                Linked bank accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-muted-foreground text-xs">
                Users with linked accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Default Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{defaultAccounts}</div>
              <p className="text-muted-foreground text-xs">
                Set as default accounts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bank Accounts</CardTitle>
          <CardDescription>
            Complete list of all linked bank accounts with user associations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={bankAccounts} />
        </CardContent>
      </Card>
    </div>
  );
}
