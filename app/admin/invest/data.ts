import { sql } from "@/lib/sql";

interface dataType {
  id: string;
  property_name: string;
  property_type: string;
  investment_amount: number;
  image_urls: string[];
  document_urls: string[];
  created_at?: string;
  updated_at?: string;
  user: string;
}

export default async function getInvestmentData() {
  const data =
    (await sql`SELECT * FROM asset_request ORDER BY created_at DESC`) as dataType[];
  return data;
}
