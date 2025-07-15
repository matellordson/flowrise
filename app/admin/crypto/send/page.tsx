import { sql } from "@/lib/sql";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

interface dataType {
  amount: number;
  user: string;
  id: string;
  coin: string;
  wallet_address: string;
}

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  const data =
    (await sql`SELECT * FROM send_coin WHERE done = false`) as dataType[];
  return data;
}
export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto">
      <p className="text-2xl font-semibold tracking-tight">Send</p>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
