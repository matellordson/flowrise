import { neon } from "@neondatabase/serverless";

export const sql = neon(
  "postgresql://neondb_owner:npg_yj9ngkCEZil8@ep-flat-sun-a8y94kuf-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
);
