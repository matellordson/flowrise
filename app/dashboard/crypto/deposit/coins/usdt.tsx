"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Copy, OctagonAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TokenBNB, TokenBTC, TokenUSDT } from "@web3icons/react";
import { sql } from "@/lib/sql";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

async function getUsdtPrice() {
  const res = await fetch("https://api.coinpaprika.com/v1/tickers/usdt-tether");
  const data = await res.json();
  const price = data?.quotes?.USD?.price || "0.00";

  return price;
}

const usdtPrice = await getUsdtPrice();

const formSchema = z.object({
  amount: z.coerce.number(),
});

export default function DepositBNB() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(100);

  const [copied, setCopied] = React.useState(false);
  const textToCopy = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: 100 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = values.amount;
    const coin = "bitcoin";
    await sql`INSERT INTO crypto_deposit (user_email, amount, coin) VALUES (${session?.user?.email}, ${amount}, ${coin})`;

    toast("Kindly proceed to make a deposit");

    redirect("/dashboard");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TokenUSDT variant="mono" className="size-8" />
          Tether
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit USDT</DialogTitle>
        </DialogHeader>
        {/* alert */}
        <Alert
          variant="default"
          className="border border-[--warning-border] bg-[var(--warning)] text-[var(--warning-forground)]"
        >
          <OctagonAlert />
          <AlertTitle className="font-semibold">
            Deposit Instructions
          </AlertTitle>
          <AlertDescription className="text-[var(--warning-forground)">
            Please copy the wallet address and send the coins to it. Once the
            transaction is confirmed on the network, your deposited coins will
            appear in your wallet.
          </AlertDescription>
        </Alert>

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <p className="text-muted-foreground text-sm">
                    <span className="text-primary font-semibold">
                      {Number(amount || 0).toLocaleString("en-US", {
                        currency: "USD",
                        style: "currency",
                      })}
                    </span>{" "}
                    ≈{" "}
                    <span className="text-primary font-semibold">
                      {Number(amount / usdtPrice)
                        .toFixed(8)
                        .replace(/\.?0+$/, "")}{" "}
                      USDT
                    </span>
                  </p>
                  <FormLabel>Amount </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      min={100}
                      onChange={(e) => {
                        const value = e.target.value;
                        const num = Number(value);

                        // Only allow positive numbers
                        if (num >= 0 || value === "") {
                          field.onChange(value); // Update form value
                          setAmount(value as any); // Update local state
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* copy address */}
            <div className="">
              <div className="bg-muted relative flex w-full items-center justify-center rounded py-2 font-mono">
                <span className="text-muted-forground flex-1 overflow-hidden text-center text-sm select-all">
                  <span className="inline-block max-w-full">
                    <span className="inline">{textToCopy.slice(0, 6)}</span>
                    <span className="text-muted-foreground/60 inline">...</span>
                    <span className="inline">{textToCopy.slice(-6)}</span>
                  </span>
                </span>
                <button
                  onClick={handleCopy}
                  className="hover:bg-background/80 absolute right-3 rounded p-1 transition-colors"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="text-muted-foreground hover:text-foreground h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Make Deposit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
