import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

interface dataType {
  id: string;
  pair: string;
  created_at: string;
  trade_end: string;
  users: string[]; // Array of user names/emails as strings
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
      <p className="mb-5 text-3xl tracking-tight">Signal</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
