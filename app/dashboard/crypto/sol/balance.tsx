import { getSolBal, getSolPrice } from "../coins-bal";

export default async function SOLBalance() {
  const balance = await getSolBal();
  const price = await getSolPrice();
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
        SOL
      </p>
    </div>
  );
}
