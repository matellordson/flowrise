import { sql } from "@/lib/sql";
import { columns, type Payment } from "./column";
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

async function getData(): Promise<Payment[]> {
  try {
    // Fetch bank transfers
    const bankTransfers = (await sql`
      SELECT *
      FROM bank_transfer 
      WHERE status = false 
      ORDER BY created_at DESC
    `) as BankTransferData[];

    // Fetch card payments
    const cardPayments = (await sql`
      SELECT *
      FROM card_transfer 
      WHERE status = false 
      ORDER BY created_at DESC
    `) as CardPaymentData[];

    // Transform and combine the data
    const bankPayments: Payment[] = bankTransfers.map((transfer) => ({
      ...transfer,
      payment_type: "bank" as const,
    }));

    const cardPaymentsList: Payment[] = cardPayments.map((payment) => ({
      ...payment,
      payment_type: "card" as const,
    }));

    // Combine and sort by amount (you could also sort by created_at if available)
    return [...bankPayments, ...cardPaymentsList].sort(
      (a, b) => b.amount - a.amount,
    );
  } catch (error) {
    console.error("Error fetching payment data:", error);
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
