import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";

// *DO NOT* create a `Pool` here, outside the request handler.

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: NeonAdapter(pool as any),
    providers: [Resend, Google],
    session: {
      strategy: "database", // Uses database sessions (good with Neon)
    },
  };
});
