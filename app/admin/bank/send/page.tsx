import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

interface dataType {
  id: string;
  user: string;
  email: string;
  amount: number;
  bank_name: string;
  account_number: string;
  routing_number: string;
}

async function getData(): Promise<Payment[]> {
  const data =
    (await sql`SELECT * FROM bank_transfer WHERE status = false ORDER BY created_at DESC`) as dataType[];

  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <p className="mb-5 text-3xl tracking-tight">Send</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
