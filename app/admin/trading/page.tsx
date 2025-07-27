import Link from "next/link";

export default function TradingAdmin() {
  return (
    <div>
      <p className="text-2xl tracking-tight">Trading</p>
      <div className="mt-4 underline underline-offset-3">
        <ul className="space-y-3">
          <li>
            <Link href={"/admin/trading/accounts"}>All trading accounts</Link>
          </li>
          <li>
            <Link href={"/admin/trading/deposit"}>New account deposit</Link>
          </li>
          <li>
            <Link href={"/admin/trading/deposit2"}>Deposit</Link>
          </li>
          <li>
            <Link href={"/admin/trading/send"}>Send</Link>
          </li>
          <li>
            <Link href={"/admin/trading/signal"}>Signal</Link>
          </li>
          <li>
            <Link href={"/admin/trading/create-signal"}>Create Signal</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
