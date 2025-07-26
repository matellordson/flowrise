import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

interface dataType {
  id: string;
  amount: number;
  pair: string;
}

async function getData(): Promise<Payment[]> {
  const data =
    (await sql`SELECT * FROM signal WHERE open = true ORDER BY created_at DESC`) as dataType[];

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
