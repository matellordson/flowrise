import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: new Pool({
    connectionString:
      "postgresql://neondb_owner:npg_yj9ngkCEZil8@ep-flat-sun-a8y94kuf-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
