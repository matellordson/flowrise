"use server";

import { auth } from "@/lib/auth";

export default async function LoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await auth.api.signInEmail({
    body: {
      email: email,
      password: password,
    },
  });

  console.log("Login successfully");
}
