import Link from "next/link";

export default function AdminCrypto() {
  return (
    <div className="">
      <p className="text-2xl font-semibold tracking-tight">Admin, Crypto</p>
      <Link href={"/admin/crypto/deposit"}>deposit</Link>
    </div>
  );
}
