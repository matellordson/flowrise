import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import Google from "next-auth/providers/google";
import Loops from "next-auth/providers/loops";

// *DO NOT* create a `Pool` here, outside the request handler.

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: NeonAdapter(pool as any),
    providers: [
      Loops({
        apiKey: process.env.AUTH_LOOPS_KEY!,
        transactionalId: process.env.AUTH_LOOPS_TRANSACTIONAL_ID!,
      }) as any, // Type assertion to resolve the provider type mismatch
      Google,
    ],
    pages: {
      signIn: "/sign-in",
    },

    session: {
      strategy: "database", // Uses database sessions (good with Neon)
    },
  };
});
