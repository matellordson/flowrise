"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TokenBNB,
  TokenBTC,
  TokenETH,
  TokenSOL,
  TokenUSDC,
  TokenUSDT,
  TokenXRP,
} from "@web3icons/react";
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OctagonAlert, Send, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const FormSchema = z.object({
  amount: z.coerce.number().min(100, {
    message: "Coin value should be atleast $100",
  }),
  coin: z.string({
    required_error: "Please select coin",
  }),
  wallet_address: z.string().min(1, {
    message: "Please provide a wallet address",
  }),
});

// Coin display names mapping
const coinDisplayNames: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  bnb: "BNB",
  usdc: "USDC",
  usdt: "USDT",
  xrp: "XRP",
};

// Async function to fetch coin prices
async function fetchCoinPrices(): Promise<Record<string, number>> {
  try {
    // Example using CoinGecko API - replace with your preferred API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,usd-coin,tether,ripple&vs_currencies=usd",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }

    const data = await response.json();

    // Map API response to our coin keys
    return {
      bitcoin: data.bitcoin?.usd || 0,
      ethereum: data.ethereum?.usd || 0,
      solana: data.solana?.usd || 0,
      bnb: data.binancecoin?.usd || 0,
      usdc: data["usd-coin"]?.usd || 1,
      usdt: data.tether?.usd || 1,
      xrp: data.ripple?.usd || 0,
    };
  } catch (error) {
    console.error("Error fetching coin prices:", error);
    // Return fallback prices if API fails
    return {
      bitcoin: 45000,
      ethereum: 2500,
      solana: 100,
      bnb: 300,
      usdc: 1,
      usdt: 1,
      xrp: 0.6,
    };
  }
}

export default function SendDrawer() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 100,
      coin: "",
      wallet_address: "",
    },
  });

  const router = useRouter();
  const { data: session } = useSession();
  const [coin, setCoin] = useState<string>("");
  const [selectedCoinKey, setSelectedCoinKey] = useState<string>("");
  const [amount, setAmount] = useState<number>(100);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState<boolean>(true);
  const [pricesError, setPricesError] = useState<string>("");

  // Fetch prices on component mount
  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setPricesLoading(true);
    setPricesError("");
    try {
      const fetchedPrices = await fetchCoinPrices();
      setPrices(fetchedPrices);
    } catch (error) {
      setPricesError("Failed to load current prices");
      console.error("Error loading prices:", error);
    } finally {
      setPricesLoading(false);
    }
  };

  // Custom handler to update both form field and local state
  const handleCoinChange = (value: string) => {
    form.setValue("coin", value); // Update form field
    setCoin(coinDisplayNames[value] || value); // Update local state with display name
    setSelectedCoinKey(value); // Store the coin key for price lookup
  };

  // Function to calculate coin amount from USD
  const calculateCoinAmount = (usdAmount: number, coinKey: string): number => {
    const price = prices[coinKey];
    if (!price || price === 0) return 0;
    return usdAmount / price;
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    async function submit() {
      await sql`INSERT INTO send_coin (coin, amount, "user", wallet_address) VALUES (${data.coin}, ${data.amount}, ${session?.user?.email}, ${data.wallet_address})`;
    }
    try {
      submit();
      toast("Request has been sent successfully.");
      setOpen(false); // Close the dialog after successful submission
    } catch (error) {
      console.error(error);
      toast("An error occurred. Please try again.");
    }
  }

  const [open, setOpen] = React.useState(false);

  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coin</FormLabel>
              <Select
                onValueChange={handleCoinChange} // Use custom handler
                defaultValue={field.value}
                disabled={pricesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        pricesLoading ? "Loading coins..." : "Select a coin"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bitcoin">
                    <div className="flex items-center gap-2">
                      <TokenBTC variant="mono" />
                      <span>Bitcoin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ethereum">
                    <div className="flex items-center gap-2">
                      <TokenETH variant="mono" />
                      <span>Ethereum</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="solana">
                    <div className="flex items-center gap-2">
                      <TokenSOL variant="mono" />
                      <span>Solana</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bnb">
                    <div className="flex items-center gap-2">
                      <TokenBNB variant="mono" />
                      <span>Binance Coin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="usdc">
                    <div className="flex items-center gap-2">
                      <TokenUSDC variant="mono" />
                      <span>USDC</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="usdt">
                    <div className="flex items-center gap-2">
                      <TokenUSDT variant="mono" />
                      <span>Tether</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="xrp">
                    <div className="flex items-center gap-2">
                      <TokenXRP variant="mono" />
                      <span>XRP</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormDescription>
                {field.value > 0 && (
                  <>
                    {Number(field.value).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                    {coin && selectedCoinKey && !pricesLoading && (
                      <span>
                        {" ≈ "}
                        {calculateCoinAmount(
                          field.value,
                          selectedCoinKey,
                        ).toFixed(6)}{" "}
                        {coin}
                      </span>
                    )}
                    {pricesLoading && (
                      <Skeleton className="ml-2 inline-block h-4 w-20" />
                    )}
                  </>
                )}
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  min="100"
                  step="1"
                  placeholder="Enter amount in USD"
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value); // Update react-hook-form
                    setAmount(value); // Update local state
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wallet_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter recipient wallet address"
                />
              </FormControl>
              <FormDescription>
                This is the recipient wallet address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pricesLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Send
            {pricesError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadPrices}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>Send coins to another wallet.</DialogDescription>
        </DialogHeader>

        {pricesError && (
          <Alert variant="destructive" className="mb-4">
            <OctagonAlert className="h-4 w-4" />
            <AlertDescription>
              {pricesError}. Using fallback prices.{" "}
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={loadPrices}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Alert
          variant="default"
          className="border border-[--warning-border] bg-[var(--warning)] text-[var(--warning-forground)]"
        >
          <OctagonAlert className="h-4 w-4" />
          <AlertDescription>
            Please provide the coin transfer details. Once submitted, your coins
            will be successfully transferred within 24 hours.
          </AlertDescription>
        </Alert>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
}
