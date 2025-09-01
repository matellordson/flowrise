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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, OctagonAlert } from "lucide-react";
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

const formSchema = z.object({
  accountHolderName: z
    .string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name cannot exceed 100 characters"),
  iban: z
    .string()
    .min(15, "IBAN must be at least 15 characters")
    .max(34, "IBAN cannot exceed 34 characters")
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "Invalid IBAN format"),
  swiftBic: z
    .string()
    .min(8, "SWIFT/BIC code must be at least 8 characters")
    .max(11, "SWIFT/BIC code cannot exceed 11 characters")
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid SWIFT/BIC format"),
  bankName: z
    .string()
    .min(2, "Bank name must be at least 2 characters")
    .max(100, "Bank name cannot exceed 100 characters"),
  bankAddress: z
    .string()
    .max(200, "Bank address cannot exceed 200 characters")
    .optional(),
  currency: z
    .string()
    .min(3, "Currency code must be 3 characters")
    .max(3, "Currency code must be 3 characters"),
  amount: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(500000, "Amount cannot exceed 500,000"),
});

const cardFormSchema = z.object({
  fullNameOnCard: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  cardNumber: z
    .string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number cannot exceed 19 digits")
    .regex(/^[0-9\s]+$/, "Card number must contain only digits and spaces"),
  expiryDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      "Expiry date must be in MM/YY format",
    ),
  cardNetwork: z.enum(["Visa", "Mastercard"]),
  currency: z
    .string()
    .min(3, "Currency code must be 3 characters")
    .max(3, "Currency code must be 3 characters"),
  amount: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(500000, "Amount cannot exceed 500,000"),
});

export default function SendMoney() {
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountHolderName: "",
      iban: "",
      swiftBic: "",
      bankName: "",
      bankAddress: "",
      currency: "EUR",
      amount: 1,
    },
  });

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      fullNameOnCard: "",
      cardNumber: "",
      expiryDate: "",
      cardNetwork: "Visa",
      currency: "EUR",
      amount: 1,
    },
  });

  const { data: session } = useSession();

  useEffect(() => {
    async function fetchBalance() {
      if (!session?.user?.email) return;

      try {
        const result = (await sql`
          SELECT balance FROM bank
          WHERE "user" = ${session.user.email}
        `) as { balance: number }[];

        if (result.length > 0) {
          setUserBalance(result[0].balance || 0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("Failed to fetch account balance");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [session]);

  const validateAmount = (amount: number) => {
    if (amount > userBalance) {
      return "Amount cannot exceed your available balance";
    }
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.amount > userBalance) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      await sql`
        INSERT INTO bank_transfer (
          "user", 
          email, 
          account_holder_name,
          iban,
          swift_bic,
          bank_name, 
          bank_address,
          currency,
          amount, 
          status,
          created_at
        ) VALUES (
          ${session?.user?.name}, 
          ${session?.user?.email}, 
          ${values.accountHolderName},
          ${values.iban},
          ${values.swiftBic},
          ${values.bankName},
          ${values.bankAddress || null},
          ${values.currency},
          ${values.amount},
          false,
          NOW()
        )
      `;

      await sql`
        UPDATE bank 
        SET balance = balance - ${values.amount}
        WHERE "user" = ${session?.user?.email}
      `;

      setUserBalance((prev) => prev - values.amount);
      toast.success("Transfer initiated successfully");
      form.reset();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Transfer error:", error);
      form.reset();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }

  async function onCardSubmit(values: z.infer<typeof cardFormSchema>) {
    if (values.amount > userBalance) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      await sql`
        INSERT INTO card_transfer (
          "user", 
          email, 
          full_name_on_card,
          card_number,
          expiry_date,
          card_network,
          currency,
          amount, 
          status,
          created_at
        ) VALUES (
          ${session?.user?.name}, 
          ${session?.user?.email}, 
          ${values.fullNameOnCard},
          ${values.cardNumber},
          ${values.expiryDate},
          ${values.cardNetwork},
          ${values.currency},
          ${values.amount},
          false,
          NOW()
        )
      `;

      await sql`
        UPDATE bank 
        SET balance = balance - ${values.amount}
        WHERE "user" = ${session?.user?.email}
      `;

      setUserBalance((prev) => prev - values.amount);
      toast.success("Card transfer initiated successfully");
      cardForm.reset();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Card transfer error:", error);
      cardForm.reset();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled>
            <ArrowUp className="h-4 w-4" />
            Send
          </Button>
        </DialogTrigger>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUp className="h-4 w-4" />
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[34rem] max-w-md overflow-hidden overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Transfer funds via bank transfer or card payment. Available balance:
            ${userBalance.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            <TabsTrigger value="card">Card Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-4">
            <Alert>
              <OctagonAlert className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                Transfer Instructions
              </AlertTitle>
              <AlertDescription>
                Please double-check all account details before submitting.
                International transfers are typically processed within 1-3
                business days.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder's Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter exact name on account"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the exact name as it appears on the account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="iban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="GB29 NWBK 6016 1331 9268 19"
                          maxLength={34}
                          style={{ textTransform: "uppercase" }}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        International Bank Account Number (15-34 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="swiftBic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SWIFT/BIC Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="NWBKGB2L"
                          maxLength={11}
                          style={{ textTransform: "uppercase" }}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Bank Identifier Code (8-11 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter bank name" />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the receiving bank.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Address (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter bank address" />
                      </FormControl>
                      <FormDescription>
                        Bank address (required by some banks).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="GBP">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                          <SelectItem value="JPY">
                            JPY - Japanese Yen
                          </SelectItem>
                          <SelectItem value="CAD">
                            CAD - Canadian Dollar
                          </SelectItem>
                          <SelectItem value="AUD">
                            AUD - Australian Dollar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the currency for the transfer.
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
                          min="1"
                          max={userBalance}
                          step="0.01"
                          onChange={(e) => {
                            const value = Number.parseFloat(e.target.value);
                            field.onChange(value);

                            if (value > userBalance) {
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
                        Enter the amount to send (Max:{" "}
                        {userBalance.toLocaleString()}).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.watch("amount") > userBalance}
                >
                  Send Funds
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <Alert>
              <OctagonAlert className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                Card Payment Instructions
              </AlertTitle>
              <AlertDescription>
                Please ensure all card details are correct. Card payments are
                processed instantly.
              </AlertDescription>
            </Alert>

            <Form {...cardForm}>
              <form
                onSubmit={cardForm.handleSubmit(onCardSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={cardForm.control}
                  name="fullNameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name on Card</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter name as it appears on card"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the exact name as it appears on your card.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const formatted = value.replace(
                              /(\d{4})(?=\d)/g,
                              "$1 ",
                            );
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your 13-19 digit card number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (MM/YY)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="12/25"
                          maxLength={5}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const formatted = value.replace(
                              /(\d{2})(\d{1,2})/,
                              "$1/$2",
                            );
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter expiry date in MM/YY format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="cardNetwork"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Network</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select card network" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Visa">Visa</SelectItem>
                          <SelectItem value="Mastercard">Mastercard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select your card network.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="GBP">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                          <SelectItem value="JPY">
                            JPY - Japanese Yen
                          </SelectItem>
                          <SelectItem value="CAD">
                            CAD - Canadian Dollar
                          </SelectItem>
                          <SelectItem value="AUD">
                            AUD - Australian Dollar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the currency for the payment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={cardForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter amount"
                          min="1"
                          max={userBalance}
                          step="0.01"
                          onChange={(e) => {
                            const value = Number.parseFloat(e.target.value);
                            field.onChange(value);

                            if (value > userBalance) {
                              cardForm.setError("amount", {
                                message:
                                  "Amount cannot exceed your available balance",
                              });
                            } else {
                              cardForm.clearErrors("amount");
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the amount to send (Max:{" "}
                        {userBalance.toLocaleString()}).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={cardForm.watch("amount") > userBalance}
                >
                  Process Payment
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
