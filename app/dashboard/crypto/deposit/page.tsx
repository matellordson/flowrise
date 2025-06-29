import { Card, CardContent } from "@/components/ui/card";
import DepositBTC from "./coins/bitcoin";
import DepositETH from "./coins/ethereum";
import DepositSOL from "./coins/solana";
import DepositBNB from "./coins/binance";
import DepositUSDT from "./coins/usdt";
import DepositUSDC from "./coins/usdc";
import DepositXRP from "./xrp";
import DepositDOGE from "./dodge";

export default function RecieveCoin() {
  return (
    <div className="">
      <Card>
        <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
          <DepositBTC />
          <DepositETH />
          <DepositSOL />
          <DepositBNB />
          <DepositUSDT />
          <DepositUSDC />
          <DepositXRP />
          <DepositDOGE />
        </CardContent>
      </Card>
    </div>
  );
}
