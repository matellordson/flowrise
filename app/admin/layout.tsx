import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto mt-5 max-w-7xl px-3 lg:px-0">
      <Link href={"/admin"} className="underline underline-offset-4">
        Home
      </Link>
      {children}
    </div>
  );
}
