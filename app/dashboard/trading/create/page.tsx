import TradingPlans from "../plans";

export default function Trading() {
  return (
    <div className="bg-card mx-auto max-w-5xl rounded-xl p-5">
      <div className="">
        <p className="font-semibold tracking-tight">Create a Trading Account</p>
        <p className="text-muted-foreground text-sm">
          Select a profit plan that suit your budget and trading experience.
        </p>
        <TradingPlans />
      </div>
    </div>
  );
}
