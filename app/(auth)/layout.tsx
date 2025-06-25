import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await authClient.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <main>{children}</main>;
}
