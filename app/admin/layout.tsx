export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto mt-10 max-w-7xl px-3 lg:px-0">{children}</div>;
}
