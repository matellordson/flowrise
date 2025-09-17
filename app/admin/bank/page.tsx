import Link from "next/link";

export default function BankAdmin() {
  return (
    <div>
      <p className="text-2xl tracking-tight">Banking</p>
      <div className="mt-4 underline underline-offset-3">
        <ul className="space-y-3">
          <li>
            <Link href={"/admin/bank/users"}>All users</Link>
          </li>
          <li>
            <Link href={"/admin/bank/deposit"}>Deposit</Link>
          </li>
          <li>
            <Link href={"/admin/bank/transfer"}>Transfers</Link>
          </li>
          <li>
            <Link href={"/admin/bank/saved_account_transfer"}>
              Linked bank transfer
            </Link>
          </li>
          <li>
            <Link href={"/admin/bank/linked_bank"}>Linked bank</Link>
          </li>
          <li>
            <Link href={"/admin/bank/user_details"}>User Details</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
