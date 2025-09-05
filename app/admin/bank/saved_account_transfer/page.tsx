import { sql } from "@/lib/sql";
import { columns, type SendRequest } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

async function getData(): Promise<SendRequest[]> {
  try {
    console.log("[v0] Fetching send requests data...");

    const sendRequests = (await sql`
      SELECT 
        sr.*,
        sba.account_name,
        sba.account_holder_name,
        sba.bank_name,
        sba.iban,
        sba.swift_bic,
        sba.bank_address
      FROM send_requests sr
      LEFT JOIN saved_bank_accounts sba ON sr.saved_bank_account_id = sba.id
      WHERE status = false
      ORDER BY sr.created_at DESC
    `) as {
      id: number;
      saved_bank_account_id: number | null;
      amount: number;
      created_at: string;
      status: boolean;
      user_email: string;
      user_name: string | null;
      currency: string;
      user: string | null;
      account_name: string | null;
      account_holder_name: string | null;
      bank_name: string | null;
      iban: string | null;
      swift_bic: string | null;
      bank_address: string | null;
    }[];

    console.log("[v0] Send requests found:", sendRequests.length);

    const requests: SendRequest[] = sendRequests.map((request) => ({
      id: request.id,
      user: request.user || request.user_name || request.user_email,
      email: request.user_email,
      amount: Number(request.amount),
      status: request.status,
      created_at: request.created_at,
      currency: request.currency,
      saved_bank_account_id: request.saved_bank_account_id,
      account_name: request.account_name,
      account_holder_name: request.account_holder_name,
      bank_name: request.bank_name,
      iban: request.iban,
      swift_bic: request.swift_bic,
      bank_address: request.bank_address,
    }));

    return requests;
  } catch (error) {
    console.error("[v0] Error fetching send requests:", error);
    return [];
  }
}

export default async function SendRequestsPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Linked bank transfer
        </h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
