import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  const data =
    (await sql`SELECT id, user_email, amount, coin FROM crypto_deposit WHERE funded = false ORDER BY created_at DESC`) as Payment[];
  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto">
      <p className="text-2xl font-semibold tracking-tight">Deposits</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
