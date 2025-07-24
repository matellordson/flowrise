"use server";

import { sql } from "@/lib/sql";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

type ActionState =
  | {
      error: string;
      success?: undefined;
    }
  | {
      success: boolean;
      error?: undefined;
    }
  | null;

export async function updateBalance(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const amount = formData.get("amount") as string;
  const id = formData.get("id") as string;

  if (!amount || !id) {
    return { error: "Amount and ID are required" };
  }

  const numericAmount = Number.parseFloat(amount);

  if (isNaN(numericAmount)) {
    return { error: "Invalid amount" };
  }

  try {
    await sql`UPDATE bank SET balance = ${numericAmount} WHERE id = ${id}`;
    revalidatePath("/admin/banking/users"); // Adjust path as needed
    return { success: true };
  } catch (error) {
    console.error("Failed to update balance:", error);
    return { error: "Failed to update balance" };
  }
}
