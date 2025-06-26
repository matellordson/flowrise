"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  amount: z.string({ required_error: "Amount is required" }),
});

export default function DepositBTC() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [copied, setCopied] = React.useState(false);
  const textToCopy = "fjihjgfjjhfufhfihharhrhuj";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0.0005",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Bitcoin</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit Bitcoin</DialogTitle>
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
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum amount of Bitcoin is 0.0005.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Make Deposit
              </Button>
            </form>
          </Form>
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Bitcoin</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Deposit Bitcoin</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 space-y-5">
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
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum amount of Bitcoin is 0.0005.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Make Deposit
              </Button>
            </form>
          </Form>
        </div>
        <DrawerFooter className="pt-2 pb-5">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
