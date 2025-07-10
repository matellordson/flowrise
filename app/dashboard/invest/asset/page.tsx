import {
  Clock,
  Clock2,
  Clock3,
  Clock4,
  DollarSign,
  PieChart,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";
import Link from "next/link";

interface assetType {
  id: string;
  property: string;
  type: string;
  investment_amount: string;
  current_value: number;
  monthly_return: number;
  status: boolean;
  roi: number;
  image_url: string;
}

export default async function Dashboard() {
  const totalInvestment = 3400;
  const totalCurrentValue = 3780;
  const totalMonthlyReturn = 12987;
  const totalGain = totalCurrentValue - totalInvestment;
  const overallROI = ((totalGain / totalInvestment) * 100).toFixed(1);

  const session = await auth();
  const investments =
    (await sql`SELECT * FROM asset WHERE "user" = ${session?.user?.email}`) as assetType[];

  return (
    <div className="bg-background min-h-screen">
      <div className="space-y-6 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invested
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-bold">
                ${totalInvestment.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Value
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-bold">
                ${totalCurrentValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Returns
              </CardTitle>
              <PieChart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-bold">
                ${totalMonthlyReturn.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall ROI</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl font-bold text-[var(--brand)]">
                {overallROI}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Properties */}
        <div>
          <div className="mb-3 flex w-full items-center justify-between">
            <h2 className="mb-4 text-xl font-semibold">Your Assets</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={"/dashboard/invest/asset/new-asset"}>
                <Plus /> New Asset
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investments.map((investment) => (
              <Card key={investment.id} className="overflow-hidden py-0 pb-4">
                <div className="relative aspect-video">
                  <img
                    src={investment.image_url || "/placeholder.svg"}
                    alt={investment.property}
                    className="h-full w-full object-cover opacity-90 dark:opacity-80"
                  />
                  <Badge
                    className={`absolute top-2 right-5 ${
                      investment.status === true
                        ? "border border-green-700 bg-green-500/20 text-green-800 dark:text-green-100"
                        : "border border-orange-300 bg-orange-400/80 text-orange-100 dark:bg-orange-400/60 dark:text-orange-50"
                    }`}
                  >
                    {investment.status ? "Active" : "Pending"}
                  </Badge>
                </div>
                <CardHeader className="capitalize">
                  <CardTitle className="text-lg">
                    {investment.property}
                  </CardTitle>
                  <CardDescription>{investment.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wide">
                      Invested
                    </span>
                    <span className="font-mono font-semibold">
                      {investment.status ? (
                        <>${investment.investment_amount.toLocaleString()}</>
                      ) : (
                        <Clock size={16} />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wide">
                      Current Value
                    </span>
                    <span className="font-mono font-semibold">
                      {investment.status ? (
                        <>${investment.current_value.toLocaleString()}</>
                      ) : (
                        <Clock2 size={16} />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wide">
                      Monthly Return
                    </span>
                    <span className="font-mono font-semibold">
                      {investment.status ? (
                        <>${investment.monthly_return.toLocaleString()}</>
                      ) : (
                        <Clock3 size={16} />
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground tracking-wide">
                      ROI
                    </span>
                    <span className="font-mono font-semibold text-[var(--brand)]">
                      {investment.status ? (
                        <>{investment.roi.toLocaleString()}%</>
                      ) : (
                        <Clock4 size={16} />
                      )}
                    </span>
                  </div>
                  <Button
                    className="mt-4 w-full bg-transparent"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
