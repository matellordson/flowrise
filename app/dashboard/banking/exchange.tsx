"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, OctagonAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { z } from "zod";
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  TokenBNB,
  TokenBTC,
  TokenETH,
  TokenSOL,
  TokenUSDC,
  TokenUSDT,
  TokenXRP,
} from "@web3icons/react";

const formSchema = z.object({
  cryptoType: z.string().min(1, "Please select a cryptocurrency"),
  amount: z
    .number()
    .min(0.01, "Amount must be at least 0.01")
    .max(1000000, "Amount cannot exceed 1,000,000"),
});

interface CryptoBalance {
  bitcoin: number;
  ethereum: number;
  solana: number;
  bnb: number;
  usdc: number;
  usdt: number;
  xrp: number;
}

export default function ExchangeMoney() {
  const [cryptoBalances, setCryptoBalances] = useState<CryptoBalance>({
    bitcoin: 0,
    ethereum: 0,
    solana: 0,
    bnb: 0,
    usdc: 0,
    usdt: 0,
    xrp: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cryptoType: "",
      amount: 100,
    },
  });

  const { data: session } = useSession();
  const selectedCrypto = form.watch("cryptoType");
  const maxAmount = selectedCrypto
    ? cryptoBalances[selectedCrypto as keyof CryptoBalance]
    : 0;

  // Fetch crypto balances
  useEffect(() => {
    async function fetchCryptoBalances() {
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const [
          bitcoinResult,
          ethereumResult,
          solanaResult,
          bnbResult,
          usdcResult,
          usdtResult,
          xrpResult,
        ] = await Promise.all([
          sql`SELECT amount FROM bitcoin WHERE "user" = ${session.user.email} LIMIT 1`,
          sql`SELECT amount FROM ethereum WHERE "user" = ${session.user.email} LIMIT 1`,
          sql`SELECT amount FROM solana WHERE "user" = ${session.user.email} LIMIT 1`,
          sql`SELECT amount FROM bnb WHERE "user" = ${session.user.email} LIMIT 1`,
          sql`SELECT amount FROM usdc WHERE "user" = ${session.user.email} LIMIT 1`,
          sql`SELECT amount FROM usdt WHERE "user" = ${session.user.email} LIMIT 1`,
          sql`SELECT amount FROM xrp WHERE "user" = ${session.user.email} LIMIT 1`,
        ]);

        setCryptoBalances({
          bitcoin: bitcoinResult[0]?.amount || 0,
          ethereum: ethereumResult[0]?.amount || 0,
          solana: solanaResult[0]?.amount || 0,
          bnb: bnbResult[0]?.amount || 0,
          usdc: usdcResult[0]?.amount || 0,
          usdt: usdtResult[0]?.amount || 0,
          xrp: xrpResult[0]?.amount || 0,
        });
      } catch (error) {
        console.error("Error fetching crypto balances:", error);
        toast.error("Failed to fetch crypto balances");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCryptoBalances();
  }, [session]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const availableBalance =
      cryptoBalances[values.cryptoType as keyof CryptoBalance];

    if (values.amount > availableBalance) {
      toast.error("Insufficient crypto balance");
      return;
    }

    try {
      // Initialize balanceCheck to an empty array to ensure it's always defined
      let balanceCheck: any[] = []; // Use any[] for flexibility with SQL query results

      // Check crypto balance again before processing
      if (values.cryptoType === "bitcoin") {
        balanceCheck =
          await sql`SELECT amount FROM bitcoin WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else if (values.cryptoType === "ethereum") {
        balanceCheck =
          await sql`SELECT amount FROM ethereum WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else if (values.cryptoType === "solana") {
        balanceCheck =
          await sql`SELECT amount FROM solana WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else if (values.cryptoType === "bnb") {
        balanceCheck =
          await sql`SELECT amount FROM bnb WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else if (values.cryptoType === "usdc") {
        balanceCheck =
          await sql`SELECT amount FROM usdc WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else if (values.cryptoType === "usdt") {
        balanceCheck =
          await sql`SELECT amount FROM usdt WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else if (values.cryptoType === "xrp") {
        balanceCheck =
          await sql`SELECT amount FROM xrp WHERE "user" = ${session?.user?.email} LIMIT 1`;
      } else {
        // Handle unexpected cryptoType, though Zod schema should prevent this
        toast.error("Invalid cryptocurrency selected.");
        return;
      }

      const currentCryptoBalance = balanceCheck[0]?.amount || 0;

      if (values.amount > currentCryptoBalance) {
        toast.error("Insufficient funds - balance may have changed");
        setCryptoBalances((prev) => ({
          ...prev,
          [values.cryptoType]: currentCryptoBalance,
        }));
        return;
      }

      // Start transaction: subtract from crypto table
      if (values.cryptoType === "bitcoin") {
        await sql`UPDATE bitcoin SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      } else if (values.cryptoType === "ethereum") {
        await sql`UPDATE ethereum SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      } else if (values.cryptoType === "solana") {
        await sql`UPDATE solana SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      } else if (values.cryptoType === "bnb") {
        await sql`UPDATE bnb SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      } else if (values.cryptoType === "usdc") {
        await sql`UPDATE usdc SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      } else if (values.cryptoType === "usdt") {
        await sql`UPDATE usdt SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      } else if (values.cryptoType === "xrp") {
        await sql`UPDATE xrp SET amount = amount - ${values.amount} WHERE "user" = ${session?.user?.email}`;
      }

      // Add to bank table
      await sql`
        UPDATE bank 
        SET balance = balance + ${values.amount}
        WHERE "user" = ${session?.user?.email}
      `;

      // Insert exchange history
      await sql`
        INSERT INTO bank_history (
          "user", 
          amount, 
          type,
          created_at
        ) VALUES (
          ${session?.user?.name || session?.user?.email}, 
          ${values.amount},
          'exchange',
          NOW()
        )
      `;

      // Update local state
      setCryptoBalances((prev) => ({
        ...prev,
        [values.cryptoType]:
          prev[values.cryptoType as keyof CryptoBalance] - values.amount,
      }));

      toast.success(
        `Successfully exchanged ${values.amount} ${values.cryptoType.toUpperCase()} to USD`,
      );
      form.reset({
        cryptoType: "",
        amount: 0.01,
      });

      window.location.href = "/dashboard/banking";
    } catch (error) {
      console.error("Exchange error:", error);
      toast.error("Failed to process exchange");
    }
  }

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled>
            <RefreshCw className="h-4 w-4" />
            Exchange
          </Button>
        </DialogTrigger>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4" />
          Exchange
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Exchange Crypto to USD</DialogTitle>
          <DialogDescription>
            Convert your cryptocurrency balance to USD in your bank account.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <OctagonAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Exchange Instructions
          </AlertTitle>
          <AlertDescription>
            Select the cryptocurrency you want to exchange and enter the amount.
            The USD equivalent will be added to your bank balance.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cryptoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cryptocurrency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bitcoin">
                        <TokenBTC variant="mono" /> Bitcoin ≈{" "}
                        {Number(cryptoBalances.bitcoin).toLocaleString(
                          "en-US",
                          { style: "currency", currency: "USD" },
                        )}
                      </SelectItem>
                      <SelectItem value="ethereum">
                        <TokenETH variant="mono" /> Ethereum ≈{" "}
                        {Number(cryptoBalances.ethereum).toLocaleString(
                          "en-US",
                          { style: "currency", currency: "USD" },
                        )}{" "}
                      </SelectItem>
                      <SelectItem value="solana">
                        <TokenSOL variant="mono" /> Solana ≈{" "}
                        {Number(cryptoBalances.solana).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                      </SelectItem>
                      <SelectItem value="bnb">
                        <TokenBNB variant="mono" /> BNB ≈{" "}
                        {Number(cryptoBalances.bnb).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </SelectItem>
                      <SelectItem value="usdc">
                        <TokenUSDC variant="mono" /> USDC ≈{" "}
                        {Number(cryptoBalances.usdc).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                      </SelectItem>
                      <SelectItem value="usdt">
                        <TokenUSDT variant="mono" /> USDT ≈{" "}
                        {Number(cryptoBalances.usdt).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                      </SelectItem>
                      <SelectItem value="xrp">
                        <TokenXRP variant="mono" /> XRP ≈{" "}
                        {Number(cryptoBalances.xrp).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}{" "}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which cryptocurrency to exchange.
                  </FormDescription>
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
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter amount"
                      min="100"
                      max={maxAmount}
                      step="0.01"
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value);
                        field.onChange(value);

                        if (value > maxAmount) {
                          form.setError("amount", {
                            message:
                              "Amount cannot exceed your available balance",
                          });
                        } else {
                          form.clearErrors("amount");
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {selectedCrypto
                      ? `Max: ${maxAmount} ${selectedCrypto.toUpperCase()}`
                      : "Select a cryptocurrency first"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedCrypto || form.watch("amount") > maxAmount}
            >
              Exchange to USD
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
