"use client";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface PriceData {
  time: string;
  price: number;
  timestamp: number;
}

interface RealtimeChartProps {
  pair: string;
  currentPrice: number;
}

export function RealtimeChart({ pair, currentPrice }: RealtimeChartProps) {
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPrice, setLastPrice] = useState(currentPrice);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const addDataPoint = (price: number, isSimulated = false) => {
    const now = new Date();
    const newDataPoint: PriceData = {
      time: now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      price: price,
      timestamp: now.getTime(),
    };

    setData((prevData) => {
      const newData = [...prevData, newDataPoint];
      return newData.slice(-30);
    });

    setLastPrice(price);
    if (!isSimulated) {
      setApiError(null);
      setRetryCount(0);
    }
  };

  const simulateRealisticPrice = () => {
    // Create more realistic price simulation based on the pair
    const baseVolatility = pair.includes("BTC")
      ? 0.002
      : pair.includes("ETH")
        ? 0.0015
        : pair.includes("USDT")
          ? 0.0001
          : 0.003; // XRP and others

    const randomWalk = (Math.random() - 0.5) * 2 * baseVolatility;
    const trendFactor = Math.sin(Date.now() / 100000) * 0.0005; // Subtle trend
    const newPrice = lastPrice * (1 + randomWalk + trendFactor);

    addDataPoint(Math.max(newPrice, 0.0001), true); // Ensure price doesn't go negative
  };

  const fetchRealtimePrice = async () => {
    try {
      const pairSlug = pair.toLowerCase().replace("/", "-");
      const response = await fetch(`/api/pairs/${pairSlug}?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (!result.data || !result.data.price) {
        throw new Error("Invalid response format - missing price data");
      }

      const newPrice = parseFloat(result.data.price);

      if (isNaN(newPrice) || newPrice <= 0) {
        throw new Error(`Invalid price value: ${result.data.price}`);
      }

      addDataPoint(newPrice, false);
      setIsLoading(false);
    } catch (error) {
      console.warn(
        `API unavailable for ${pair}, using simulation:`,
        error instanceof Error ? error.message : error,
      );

      setApiError(error instanceof Error ? error.message : "Unknown error");
      setRetryCount((prev) => prev + 1);

      // Use simulation when API fails
      simulateRealisticPrice();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with current price and some historical simulation
    const now = new Date();
    const initialData: PriceData[] = [];

    // Create 5 initial points with slight variations
    for (let i = 4; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      const variation = (Math.random() - 0.5) * currentPrice * 0.001;
      initialData.push({
        time: time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        price: Math.max(currentPrice + variation, 0.0001),
        timestamp: time.getTime(),
      });
    }

    setData(initialData);
    setLastPrice(currentPrice);
    setIsLoading(false);

    // Start fetching realtime data
    fetchRealtimePrice();

    // Set up interval for updates
    const interval = setInterval(fetchRealtimePrice, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [pair, currentPrice]);

  if (isLoading && data.length === 0) {
    return (
      <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  const validData = data.filter(
    (d) => d.price && !isNaN(d.price) && d.price > 0,
  );

  if (validData.length === 0) {
    return (
      <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    );
  }

  const prices = validData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange > 0 ? priceRange * 0.05 : currentPrice * 0.001;

  // Calculate price change
  const firstPrice = validData[0]?.price || 0;
  const currentDisplayPrice = validData[validData.length - 1]?.price || 0;
  const priceChange = currentDisplayPrice - firstPrice;
  const priceChangePercent =
    firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  return (
    <div className="bg-card mt-4 h-64 w-full rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Live Price Chart</h4>
          <span
            className={`rounded px-2 py-1 text-xs ${
              priceChangePercent >= 0
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {priceChangePercent >= 0 ? "+" : ""}
            {priceChangePercent.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 animate-pulse rounded-full ${
              apiError ? "bg-orange-500" : "bg-primary"
            }`}
          ></div>
          <span className="text-muted-foreground text-xs">
            ${currentDisplayPrice.toLocaleString()} •{" "}
            {apiError ? "Simulated" : "Live"}
          </span>
        </div>
      </div>

      {apiError && retryCount > 2 && (
        <div className="mb-2 rounded border border-orange-200 bg-orange-50 p-2 text-xs text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
          API unavailable - showing simulated price movements
        </div>
      )}

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={validData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Price",
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
