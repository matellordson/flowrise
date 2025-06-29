import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DepositBTC from "./coins/bitcoin";
import DepositETH from "./coins/ethereum";
import DepositSOL from "./coins/solana";
import DepositBNB from "./coins/binance";
import DepositUSDT from "./coins/usdt";
import DepositUSDC from "./coins/usdc";
import DepositXRP from "./coins/xrp";

export default function RecieveCoin() {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
          <CardDescription>
            Make a deposit and fund your crypto investment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap max-w-full mx-auto justify-center items-center gap-3 scale-90 lg:scale-100">
          <DepositBTC />
          <DepositETH />
          <DepositSOL />
          <DepositBNB />
          <DepositUSDT />
          <DepositUSDC />
          <DepositXRP />
        </CardContent>
      </Card>
    </div>
  );
}
