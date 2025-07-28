import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBuildingBank,
  IconBuildingEstate,
  IconChartLine,
  IconWallet,
} from "@tabler/icons-react";
import {
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { auth } from "@/auth";
import { sql } from "@/lib/sql";

// Types for PostgreSQL data structure
interface Balance {
  id: string;
  type: "crypto" | "asset" | "banking" | "trading";
  amount: any;
  currency: string;
  change_24h?: number;
  last_updated: string;
}

export default async function BalanceDashboard() {
  // Fetch crypto balance
  const session = await auth();

  const totalAmount = await sql`
    SELECT 
      (SELECT COALESCE(SUM(amount), 0) FROM bitcoin WHERE "user" = ${session?.user?.email}) + 
      (SELECT COALESCE(SUM(amount), 0) FROM ethereum WHERE "user" = ${session?.user?.email}) + 
      (SELECT COALESCE(SUM(amount), 0) FROM solana WHERE "user" = ${session?.user?.email}) + 
      (SELECT COALESCE(SUM(amount), 0) FROM bnb WHERE "user" = ${session?.user?.email}) + 
      (SELECT COALESCE(SUM(amount), 0) FROM usdc WHERE "user" = ${session?.user?.email}) + 
      (SELECT COALESCE(SUM(amount), 0) FROM usdt WHERE "user" = ${session?.user?.email}) + 
      (SELECT COALESCE(SUM(amount), 0) FROM xrp WHERE "user" = ${session?.user?.email}) AS total_amount 
    LIMIT 1;
  `;

  const assetBal = await sql`
    SELECT current_value FROM asset_request WHERE "user" = ${session?.user?.email}
  `;

  const bankbal = await sql`
    SELECT balance FROM bank WHERE "user" = ${session?.user?.email}
  `;

  const tradingBal = await sql`
    SELECT balance FROM trading_accounts WHERE "user" = ${session?.user?.email}
  `;

  // Fix the reduce functions with proper error handling
  const crypto = Number(totalAmount[0]?.total_amount) || 0;
  const bank = Number(bankbal[0]?.balance) || 0;
  const trade = Number(tradingBal[0]?.balance) || 0;

  // Fixed asset calculation - properly access current_value property and handle potential nulls
  const asset =
    assetBal && assetBal.length > 0
      ? assetBal.reduce((acc, item) => {
          const value = Number(item?.current_value) || 0;
          return acc + value;
        }, 0)
      : 0;

  const mockBalances: Balance[] = [
    {
      id: "1",
      type: "crypto",
      amount: crypto,
      currency: "USD",
      change_24h: 0,
      last_updated: new Date().toISOString(),
    },
    {
      id: "2",
      type: "asset",
      amount: asset, // Now using the calculated asset value instead of hardcoded 0
      currency: "USD",
      change_24h: 0,
      last_updated: new Date().toISOString(),
    },
    {
      id: "3",
      type: "banking",
      amount: bank,
      currency: "USD",
      change_24h: 0,
      last_updated: new Date().toISOString(),
    },
    {
      id: "4",
      type: "trading",
      amount: trade,
      currency: "USD",
      change_24h: 0,
      last_updated: new Date().toISOString(),
    },
  ];

  const balanceConfig = {
    crypto: {
      title: "Crypto Balance",
      icon: IconWallet,
    },
    asset: {
      title: "Asset Balance",
      icon: IconBuildingEstate,
    },
    banking: {
      title: "Banking Balance",
      icon: IconBuildingBank,
    },
    trading: {
      title: "Trading Balance",
      icon: IconChartLine,
    },
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatChange = (change: number) => {
    if (change === 0)
      return { icon: Minus, text: "0.00%", color: "text-muted-foreground" };
    const isPositive = change > 0;
    return {
      icon: isPositive ? ArrowUpRight : ArrowDownRight,
      text: `${isPositive ? "+" : ""}${change.toFixed(2)}%`,
      color: isPositive ? "text-primary" : "text-destructive",
    };
  };

  const getTotalBalance = () => {
    return mockBalances.reduce((total, balance) => {
      const amount = Number(balance.amount) || 0;
      return total + amount;
    }, 0);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Portfolio Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your balances across different platforms
        </p>
      </div>

      {/* Total Balance Card */}
      <Card className="border-2 border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-muted-foreground text-lg font-medium">
            Total Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {formatCurrency(getTotalBalance())}
          </div>
        </CardContent>
      </Card>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockBalances.map((balance) => {
          const config = balanceConfig[balance.type];
          const IconComponent = config.icon;
          const changeData = formatChange(balance.change_24h || 0);
          const ChangeIcon = changeData.icon;

          return (
            <Card key={balance.id} className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {config.title}
                </CardTitle>
                <div className="bg-secondary rounded-lg p-2">
                  <IconComponent className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      Number(balance.amount) || 0,
                      balance.currency,
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChangeIcon className={`h-4 w-4 ${changeData.color}`} />
                    <span className={`text-sm font-medium ${changeData.color}`}>
                      {changeData.text}
                    </span>
                  </div>
                  {(Number(balance.amount) || 0) === 0 && (
                    <div className="bg-muted mt-3 rounded-lg border p-3">
                      <p className="text-muted-foreground text-center text-xs">
                        No balance available
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary rounded-lg p-2">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Active Accounts
                </p>
                <p className="text-2xl font-bold">
                  {
                    mockBalances.filter((b) => (Number(b.amount) || 0) > 0)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary rounded-lg p-2">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Positive Change
                </p>
                <p className="text-2xl font-bold">
                  {mockBalances.filter((b) => (b.change_24h || 0) > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary rounded-lg p-2">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Platforms
                </p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
