import Link from "next/link";

export default function TradingAdmin() {
  return (
    <div>
      <p className="text-2xl tracking-tight">Trading</p>
      <div className="mt-4 underline underline-offset-3">
        <ul>
          <li>
            <Link href={"/admin/trading/accounts"}>All trading accounts</Link>
          </li>
          <li>
            <Link href={"/admin/trading/deposit"}>New account deposit</Link>
          </li>
          {/* <li>
            <Link href={"/admin/trading/send"}>Send</Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
