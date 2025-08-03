"use client";

import { useState } from "react";
import { ArrowDown, Copy, Check, OctagonAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sql } from "@/lib/sql";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

const formSchema = z.object({
  amount: z
    .number()
    .min(100, "Minimum deposit is $100")
    .max(500000, "Maximum deposit is $500,000"),
});

const bankDetails = {
  bankName: "Suncoast Credit Union",
  accountName: "James Hughie Wyrosdick",
  accountNumber: "10050007480540",
  routingNumber: "263182817",
};

interface CopyableFieldProps {
  label: string;
  value: string;
}

function CopyableField({ label, value }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <Input value={value} readOnly className="flex-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="shrink-0 bg-transparent"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function DepositTrade() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sql`INSERT INTO trading_deposit2 ("user" , amount) VALUES (${session?.user?.name}, ${values.amount})`;
      toast("Please proceed to making deposit");
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowDown className="h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fund your account</DialogTitle>
          <DialogDescription>
            Use the bank details below to transfer funds to your account. After
            making the transfer, enter the amount you deposited.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <OctagonAlert className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Transfer Instructions
          </AlertTitle>
          <AlertDescription>
            Transfer money to the bank account details provided below. Your
            account will be credited within 24 hours of payment confirmation.
            Please enter the exact amount you transferred in the form below.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bank Transfer Details</CardTitle>
            <CardDescription>
              Copy these details to make your bank transfer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyableField label="Bank Name" value={bankDetails.bankName} />
            <CopyableField
              label="Account Name"
              value={bankDetails.accountName}
            />
            <CopyableField
              label="Account Number"
              value={bankDetails.accountNumber}
            />
            <CopyableField
              label="Routing Number"
              value={bankDetails.routingNumber}
            />
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Transferred ($)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter amount transferred"
                      min="100"
                      max="500000"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the exact amount you transferred to the above account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Confirm Deposit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
