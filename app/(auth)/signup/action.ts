"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("username") as string;

  await auth.api.signUpEmail({
    body: {
      email: email,
      password: password,
      name: name,
    },
  });

  redirect("/login");
}
