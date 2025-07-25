import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="">
      <p className="text-3xl tracking-tight">Welcome Admin</p>
      <div className="mt-4 underline underline-offset-3">
        <ul>
          <li>
            <Link href={"/admin/crypto"} className="">
              Crypto
            </Link>
          </li>
          <li>
            <Link href={"/admin/invest"}>Asset</Link>
          </li>
          <li>
            <Link href={"/admin/bank"}>Banking</Link>
          </li>
          <li>
            <Link href={"/admin/trading"}>Trading</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
