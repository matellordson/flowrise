import Link from "next/link";

export default function AdminCrypto() {
  return (
    <div className="">
      <p className="text-2xl font-semibold tracking-tight">Crypto</p>
      <Link href={"/admin/crypto/deposit"}>Deposit</Link>
      <Link href={"/admin/crypto/send"}>Send</Link>
    </div>
  );
}
