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
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Drawer,
} from "@/components/ui/drawer";

const FormSchema = z.object({
  amount: z.coerce.number().min(100, {
    message: "Coin value should be atleast $100",
  }),
  coin: z.string({
    required_error: "Please select coin",
  }),
  wallet_address: z.string({
    required_error: "Please provide a wallet address",
  }),
});

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    async function submit() {
      await sql`INSERT INTO send_coin (coin, amount, "user", wallet_address) VALUES (${data.coin}, ${data.amount}, ${session?.user?.email}, ${data.wallet_address})`;
    }

    try {
      submit();
      toast("Request has been sent successfully.");
    } catch (error) {
      console.error(error);
    }
  }

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Send />
            Send
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send</DialogTitle>
            <DialogDescription>Send coins to another wallet.</DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="coin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a coin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bitcoin">
                            <TokenBTC variant="mono" /> Bitcoin
                          </SelectItem>
                          <SelectItem value="ethereum">
                            <TokenETH variant="mono" /> Ethereum
                          </SelectItem>
                          <SelectItem value="solana">
                            <TokenSOL variant="mono" /> Solana
                          </SelectItem>
                          <SelectItem value="bnb">
                            <TokenBNB variant="mono" /> Binance Coin
                          </SelectItem>
                          <SelectItem value="usdc">
                            <TokenUSDC variant="mono" /> USDC
                          </SelectItem>
                          <SelectItem value="usdt">
                            <TokenUSDT variant="mono" /> Tether
                          </SelectItem>
                          <SelectItem value="xrp">
                            <TokenXRP variant="mono" /> XRP
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
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the recipiant wallet.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Send />
          Send
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full">
        <DrawerHeader className="text-left">
          <DrawerTitle>Send</DrawerTitle>
          <DrawerDescription>Send coins to another wallet.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <FormField
                  control={form.control}
                  name="coin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a coin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bitcoin">
                            <TokenBTC variant="mono" /> Bitcoin
                          </SelectItem>
                          <SelectItem value="ethereum">
                            <TokenETH variant="mono" /> Ethereum
                          </SelectItem>
                          <SelectItem value="solana">
                            <TokenSOL variant="mono" /> Solana
                          </SelectItem>
                          <SelectItem value="bnb">
                            <TokenBNB variant="mono" /> Binance Coin
                          </SelectItem>
                          <SelectItem value="usdc">
                            <TokenUSDC variant="mono" /> USDC
                          </SelectItem>
                          <SelectItem value="usdt">
                            <TokenUSDT variant="mono" /> Tether
                          </SelectItem>
                          <SelectItem value="xrp">
                            <TokenXRP variant="mono" /> XRP
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
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
