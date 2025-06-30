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
import { TokenSOL } from "@web3icons/react";
import { sql } from "@/lib/sql";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  amount: z.coerce.number().gte(0.0005),
});

export default function DepositSOL() {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

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
    defaultValues: {
      amount: 0.0005,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userEmail = session?.user?.email;
    const amount = values.amount;
    const coin = "solana";
    await sql`INSERT INTO crypto_deposit (user_email, amount, coin) VALUES (${userEmail}, ${amount}, ${coin})`;
    await sql`INSERT INTO crypto (user_email) VALUES (${userEmail})`;

    toast("Kindly proceed to make a deposit");

    router.push("/dashboard/crypto");
  }

  // if (isDesktop) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <TokenSOL variant="mono" className="size-8" />
          Solana
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Solana</DialogTitle>
        </DialogHeader>
        {/* alert */}
        <Alert variant="default">
          <OctagonAlert />
          <AlertTitle>Deposit Instructions</AlertTitle>
          <AlertDescription>
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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum amount of SOL is 0.0005.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* copy address */}
            <div className="">
              <div className="bg-muted w-full py-2 flex justify-center items-center rounded font-mono relative">
                <span className="select-all flex-1 text-center overflow-hidden text-muted-forground text-sm">
                  <span className="inline-block max-w-full">
                    <span className="inline">{textToCopy.slice(0, 6)}</span>
                    <span className="inline text-muted-foreground/60">...</span>
                    <span className="inline">{textToCopy.slice(-6)}</span>
                  </span>
                </span>
                <button
                  onClick={handleCopy}
                  className="absolute right-3 p-1 rounded hover:bg-background/80 transition-colors"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
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
