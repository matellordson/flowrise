import Link from "next/link";

export default function BankAdmin() {
  return (
    <div>
      <p className="text-2xl tracking-tight">Banking</p>
      <div className="mt-4 underline underline-offset-3">
        <ul>
          <li>
            <Link href={"/admin/bank/users"}>All users</Link>
          </li>
          <li>
            <Link href={"/admin/bank/deposit"}>Deposit</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
