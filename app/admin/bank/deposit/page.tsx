import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

interface dataType {
  id: string;
  user: string;
  email: string;
  amount: number;
}

async function getData(): Promise<Payment[]> {
  const data =
    (await sql`SELECT * FROM bank_deposit WHERE done = false ORDER BY created_at DESC`) as dataType[];

  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
