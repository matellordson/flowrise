"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function signOutAction() {
  // Clear auth cookies - await the cookies() function
  const cookieStore = await cookies();
  cookieStore.delete(".Tunnels.Relay.WebForwarding.Cookies");

  // You can also delete multiple cookies if needed
  // cookieStore.delete('refresh-token')
  // cookieStore.delete('session-id')

  // Redirect to login page
  redirect("/login");
}

// // Keep this for client-side usage if needed
// export const authClient = {
//   async signOut() {
//     // Client-side cleanup
//     localStorage.removeItem("auth-token");
//     sessionStorage.removeItem("auth-token");

//     // If using a service like Supabase, Firebase, etc.
//     // await supabase.auth.signOut();

//     console.log("User signed out successfully");
//   },
// };
