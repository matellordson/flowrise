import { sql } from "@/lib/sql";

interface UserInvestmentType {
  id: string;
  property_name: string;
  property_type: string;
  investment_amount: number;
  current_value: number;
  image_urls: string[];
  document_urls: string[];
  created_at: string;
  status: boolean;
}

export default async function getUserInvestmentData(): Promise<
  UserInvestmentType[]
> {
  try {
    // Fetch base data without calculated fields
    const result = await sql`
      SELECT 
        id,
        property_name,
        property_type,
        investment_amount,
        current_value,
        image_urls,
        document_urls,
        created_at,
        status
      FROM asset_request 
      ORDER BY created_at DESC
    `;

    return result.map((row: any) => ({
      id: row.id,
      property_name: row.property_name,
      property_type: row.property_type,
      investment_amount: Number(row.investment_amount),
      current_value: Number(row.current_value),
      image_urls: Array.isArray(row.image_urls) ? row.image_urls : [],
      document_urls: Array.isArray(row.document_urls) ? row.document_urls : [],
      created_at: row.created_at,
      status: Boolean(row.status),
    }));
  } catch (error) {
    console.error("Error fetching user investment data:", error);
    return [];
  }
}
