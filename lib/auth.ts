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
  // ... your other config options
  trustedOrigins: [
    "https://fantastic-rotary-phone-97qq9x55pj6pc75pp-3000.app.github.dev", // GitHub Codespaces
    "https://localhost:3000", // Local development
    "http://localhost:3000", // Local development (HTTP)
    // Add your production domain here when you deploy
    // "https://yourdomain.com"
  ],
  // Disable origin checking in development (optional)
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "development",
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
