"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

export default async function SignupAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("username") as string;

  try {
    await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        message: error.message,
      };
    }

    return {
      message: "An unknown error occurred.",
    };
  }
}
