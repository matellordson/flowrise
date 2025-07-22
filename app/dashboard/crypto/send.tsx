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

// Async function to fetch coin prices (for USD conversion)
async function fetchCoinPrices(): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,usd-coin,tether,ripple&vs_currencies=usd",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }
    const data = await response.json();
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
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState<boolean>(true);
  const [balancesLoading, setBalancesLoading] = useState<boolean>(true);
  const [pricesError, setPricesError] = useState<string>("");
  const [balancesError, setBalancesError] = useState<string>("");

  // Fetch prices and balances on component mount
  useEffect(() => {
    loadPrices();
    if (session?.user?.email) {
      loadBalances();
    }
  }, [session?.user?.email]);

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

  const loadBalances = async () => {
    if (!session?.user?.email) return;
    setBalancesLoading(true);
    setBalancesError("");
    try {
      // Use your API route to fetch balances
      const response = await fetch(
        `/api/user-balances?email=${encodeURIComponent(session.user.email)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch balances");
      }
      const fetchedBalances = await response.json();
      setBalances(fetchedBalances);
    } catch (error) {
      setBalancesError("Failed to load balances");
      console.error("Error loading balances:", error);
      // Set fallback balances
      setBalances({
        bitcoin: 0,
        ethereum: 0,
        solana: 0,
        bnb: 0,
        usdc: 0,
        usdt: 0,
        xrp: 0,
      });
    } finally {
      setBalancesLoading(false);
    }
  };

  // Custom handler to update both form field and local state
  const handleCoinChange = (value: string) => {
    form.setValue("coin", value);
    setCoin(coinDisplayNames[value] || value);
    setSelectedCoinKey(value);
    // Clear any previous validation errors when coin changes
    form.clearErrors("amount");
  };

  // Function to calculate coin amount from USD
  const calculateCoinAmount = (usdAmount: number, coinKey: string): number => {
    const price = prices[coinKey];
    if (!price || price === 0) return 0;
    return usdAmount / price;
  };

  // Fixed function to check if user has sufficient balance
  const checkSufficientBalance = (
    usdAmount: number,
    coinKey: string,
  ): boolean => {
    if (!coinKey || balances[coinKey] === undefined) return false;
    // Compare USD amounts directly since balances appear to be in USD
    return balances[coinKey] >= usdAmount;
  };

  // Custom validation for amount field
  const validateAmount = (value: number) => {
    if (!selectedCoinKey) {
      return "Please select a coin first";
    }
    if (balancesLoading) {
      return "Loading balance...";
    }
    if (!checkSufficientBalance(value, selectedCoinKey)) {
      const availableBalance = balances[selectedCoinKey] || 0;
      return `Insufficient balance. Available: $${availableBalance.toFixed(2)}, Required: $${value.toFixed(2)}`;
    }
    return true;
  };

  // Function to update user balance for specific coin
  const updateUserBalance = async (
    coinType: string,
    coinAmountToDeduct: number,
    userEmail: string,
  ) => {
    try {
      switch (coinType) {
        case "bitcoin":
          await sql`
            UPDATE bitcoin 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        case "ethereum":
          await sql`
            UPDATE ethereum 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        case "solana":
          await sql`
            UPDATE solana 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        case "bnb":
          await sql`
            UPDATE bnb 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        case "usdc":
          await sql`
            UPDATE usdc 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        case "usdt":
          await sql`
            UPDATE usdt 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        case "xrp":
          await sql`
            UPDATE xrp 
            SET amount = amount - ${coinAmountToDeduct}
            WHERE "user" = ${userEmail}
          `;
          break;
        default:
          throw new Error(`Unsupported coin type: ${coinType}`);
      }
    } catch (error) {
      console.error(`Error updating ${coinType} balance:`, error);
      throw error;
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Additional validation before submission
    const isValid = validateAmount(data.amount);
    if (isValid !== true) {
      form.setError("amount", { message: isValid });
      return;
    }

    try {
      // Calculate the coin amount to deduct from balance
      const coinAmountToDeduct = data.amount;

      // Insert the send request into database
      await sql`INSERT INTO send_coin (coin, amount, "user", wallet_address) VALUES (${data.coin}, ${data.amount}, ${session?.user?.email}, ${data.wallet_address})`;

      // Update user balance by subtracting the sent amount using switch statement
      await updateUserBalance(
        data.coin,
        coinAmountToDeduct,
        session?.user?.email!,
      );

      toast("Request has been sent successfully.");

      // Refresh balances to show updated amounts
      await loadBalances();

      // Reset form
      form.reset({
        amount: 100,
        coin: "",
        wallet_address: "",
      });

      // Clear local state
      setCoin("");
      setSelectedCoinKey("");
      setOpen(false);
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
                onValueChange={handleCoinChange}
                defaultValue={field.value}
                disabled={balancesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        balancesLoading
                          ? "Loading balances..."
                          : "Select a coin"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bitcoin">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenBTC variant="mono" />
                        <span>Bitcoin</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="ethereum">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenETH variant="mono" />
                        <span>Ethereum</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="solana">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenSOL variant="mono" />
                        <span>Solana</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="bnb">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenBNB variant="mono" />
                        <span>Binance Coin</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="usdc">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenUSDC variant="mono" />
                        <span>USDC</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="usdt">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenUSDT variant="mono" />
                        <span>Tether</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="xrp">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TokenXRP variant="mono" />
                        <span>XRP</span>
                      </div>
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
              <FormDescription className="flex flex-col">
                {field.value > 0 && (
                  <span className="text-muted-foreground">
                    {Number(field.value).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                    {coin && selectedCoinKey && !pricesLoading && (
                      <span className="text-muted-foreground">
                        <span className="text-primary"> ≈ </span>
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
                  </span>
                )}
                {selectedCoinKey && !balancesLoading && (
                  <span className="text-muted-foreground mt-1 text-sm">
                    Available:{" "}
                    {balances[selectedCoinKey]?.toLocaleString("en-US", {
                      currency: "USD",
                      style: "currency",
                    }) || "$0.00"}
                  </span>
                )}
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="100"
                  step="0.01"
                  placeholder="Enter amount in USD"
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(value);
                    // Real-time validation
                    if (typeof value === "number" && value > 0) {
                      const validationResult = validateAmount(value);
                      if (validationResult !== true) {
                        form.setError("amount", { message: validationResult });
                      } else {
                        form.clearErrors("amount");
                      }
                    }
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

        <Button
          type="submit"
          className="w-full"
          disabled={pricesLoading || balancesLoading}
        >
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
      <DialogContent className="h-[30rem] overflow-scroll sm:max-w-[425px] lg:h-[34rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Send
            {(pricesError || balancesError) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  loadPrices();
                  loadBalances();
                }}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>Send coins to another wallet.</DialogDescription>
        </DialogHeader>

        {(pricesError || balancesError) && (
          <Alert variant="destructive" className="mb-4">
            <OctagonAlert className="h-4 w-4" />
            <AlertDescription>
              {pricesError || balancesError}. Using fallback data.{" "}
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => {
                  loadPrices();
                  loadBalances();
                }}
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
