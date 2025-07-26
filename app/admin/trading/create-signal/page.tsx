"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { useState } from "react";
import { sql } from "@/lib/sql"; // Assuming this is a server-side import or a client-side wrapper

// Form validation schema
const formSchema = z.object({
  amount: z.coerce // Coerce the input value to a number
    .number({
      error: "Amount must be a number",
    })
    .min(0.01, "Amount must be at least 0.01") // Changed to 0.01 for practical minimum
    .positive("Amount must be a positive number"),
  pair: z.string().min(1, "Please select a trading pair"),
});

type FormData = z.infer<typeof formSchema>;

// Trading pairs options
const tradingPairs = [
  { value: "BTC/USD", label: "BTC/USD" },
  { value: "ETH/USD", label: "ETH/USD" },
  { value: "USDT/USD", label: "USDT/USD" },
];

export default function TradingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0, // Changed to number
      pair: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Ensure sql is used in a server context (e.g., via a Server Action or API route)
      // If `sql` is directly imported here in a client component, it won't work as expected.
      // For client-side forms, you'd typically send data to a Next.js API route or Server Action.
      // For demonstration, I'll keep the `sql` call as you provided, but note the client/server boundary.
      // This `sql` call should ideally be wrapped in a Server Action or an API route.
      // For example: await submitTradeAction(data);
      await sql`INSERT INTO signal (amount, pair) VALUES (${data.amount}, ${data.pair})`;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error("Error submitting signal:", error);
      alert("Error submitting signal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto mt-10 w-full max-w-md">
      <CardHeader>
        <CardTitle>New Signal</CardTitle>
        <CardDescription>
          Enter the amount and select a trading pair to submit your signal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value))
                      } // Parse to float for number type
                      value={field.value === 0 ? "" : field.value} // Display empty string for 0
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pair"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Pair</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trading pair" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tradingPairs.map((pair) => (
                        <SelectItem key={pair.value} value={pair.value}>
                          {pair.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Signal"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
