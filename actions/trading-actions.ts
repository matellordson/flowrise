"use server";

import { sql } from "@/lib/sql";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function executeTrade(signalId: string) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("User not authenticated");
    }

    // Update the signal to add the user to the users array
    await sql`
      UPDATE signal 
      SET users = users || ARRAY[${session.user.email}] 
      WHERE id = ${signalId}
    `;

    // Revalidate the page to show updated data
    revalidatePath("/"); // Revalidate the root path or specific path where signals are displayed

    return { success: true, message: "Trade executed successfully" };
  } catch (error) {
    console.error("Error executing trade:", error);
    return { success: false, message: "Failed to execute trade" };
  }
}
