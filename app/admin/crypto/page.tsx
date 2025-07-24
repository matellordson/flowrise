import Link from "next/link";

export default function AdminCrypto() {
  return (
    <div className="">
      <p className="text-2xl font-semibold tracking-tight">Crypto</p>
      <div className="mt-4 underline underline-offset-3">
        <ul>
          <li>
            <Link href={"/admin/crypto/deposit"} className="">
              Deposit
            </Link>
          </li>
          <li>
            <Link href={"/admin/crypto/send"}>Send</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
