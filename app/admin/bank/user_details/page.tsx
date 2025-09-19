import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

export const revalidate = 0;

interface dataType {
  id: string;
  user_id: string;
  username: string;
  password: string;
  bank_name: string;
}

async function getData(): Promise<Payment[]> {
  const data =
    (await sql`SELECT * FROM user_detail ORDER BY submitted_at DESC`) as dataType[];

  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <p className="mb-5 text-3xl tracking-tight">User Details</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
