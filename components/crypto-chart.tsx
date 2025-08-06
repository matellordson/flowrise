"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  timestamp: number;
  price: number;
  date: string;
}

interface CryptoChartProps {
  coinId: string;
  coinName: string;
  days?: number;
}

export function CryptoChart({ coinId, coinName, days = 7 }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const data = await response.json();

        const formattedData = data.prices.map(
          ([timestamp, price]: [number, number]) => ({
            timestamp,
            price,
            date: new Date(timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          }),
        );

        setChartData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chart");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData(); // Initial fetch

    const intervalId = setInterval(fetchChartData, 5 * 60 * 1000); // Fetch every 5 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount or dependency change
  }, [coinId, days]);

  if (loading) {
    return (
      <div className="h-64 w-full space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Failed to load chart data
        </p>
      </div>
    );
  }

  const isPositive =
    chartData.length > 1 &&
    chartData[chartData.length - 1].price > chartData[0].price;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{coinName} Price Chart</h3>
        <p className="text-muted-foreground text-sm">Last {days} days</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Price",
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: isPositive ? "#22c55e" : "#ef4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
