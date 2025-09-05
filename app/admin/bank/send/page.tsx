import { sql } from "@/lib/sql";
import { columns, type Payment } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

interface BankTransferData {
  id: number;
  user: string;
  email: string;
  amount: number;
  bank_name: string;
  account_number: string;
  routing_number: string;
  status: boolean;
  created_at: string;
}

interface CardPaymentData {
  id: number;
  user: string;
  email: string;
  amount: number;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  cvv: string;
  status: boolean;
  created_at: string;
}

interface SavedAccountData {
  id: number;
  user: string;
  email: string;
  amount: number;
  saved_bank_account_id: number;
  currency: string;
  status: boolean;
  created_at: string;
}

async function getData(): Promise<Payment[]> {
  try {
    console.log("[v0] Starting to fetch payment data...");
    console.log("[v0] DATABASE_URL exists:", !!process.env.DATABASE_URL);

    const bankTransfers = (await sql`
      SELECT * FROM bank_transfer
      ORDER BY created_at DESC
    `) as BankTransferData[];

    const cardPayments = (await sql`
      SELECT * FROM card_transfer
      ORDER BY created_at DESC
    `) as CardPaymentData[];

    console.log("[v0] Bank transfers found:", bankTransfers.length);
    console.log("[v0] Card payments found:", cardPayments.length);

    const payments: Payment[] = [
      ...bankTransfers.map((transfer) => ({
        id: transfer.id,
        user: transfer.user,
        email: transfer.email,
        amount: Number(transfer.amount),
        payment_type: "bank" as const,
        status: transfer.status,
        created_at: transfer.created_at,
        account_holder_name: transfer.user,
        bank_name: transfer.bank_name,
        currency: "USD",
      })),
      ...cardPayments.map((payment) => ({
        id: payment.id,
        user: payment.user,
        email: payment.email,
        amount: Number(payment.amount),
        payment_type: "card" as const,
        status: payment.status,
        created_at: payment.created_at,
        card_holder: payment.card_holder,
        card_number: payment.card_number,
        expiry_date: payment.expiry_date,
        cvv: payment.cvv,
        currency: "USD",
      })),
    ];

    console.log("[v0] Final processed payments:", payments);
    return payments;
  } catch (error) {
    console.error("[v0] Error fetching payment data:", error);
    return [];
  }
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <p className="mb-5 text-3xl tracking-tight">Payment Requests</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
