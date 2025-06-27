import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  const data =
    (await sql`SELECT user_id, amount, coin FROM crypto_deposit`) as Payment[];
  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <p className="text-2xl tracking-tight font-semibold">Deposits</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
