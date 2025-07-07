import { getBnbBal, getBnbPrice } from "../coins-bal";

export default async function BTCBalance() {
  const balance = await getBnbBal();
  const price = await getBnbPrice();
  const btc = balance / price;

  return (
    <div className="text-center font-mono">
      <p className="text-2xl font-semibold">
        {Number(balance).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <p className="text-muted-foreground text-lg">
        {Number(btc)
          .toFixed(8)
          .replace(/\.?0+$/, "")}{" "}
        BTC
      </p>
    </div>
  );
}
