import { neon } from "@neondatabase/serverless";

export const sql = neon(
  "postgresql://neondb_owner:npg_MJ5roAWnT4lR@ep-divine-cherry-a8om7xhu-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
);
