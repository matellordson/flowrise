export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-3 lg:px-0">{children}</div>;
}
