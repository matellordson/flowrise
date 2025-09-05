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
import { ArrowUp, OctagonAlert, Plus, Trash2 } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV cannot exceed 4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
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

const saveBankAccountSchema = z.object({
  accountName: z
    .string()
    .min(2, "Account name must be at least 2 characters")
    .max(50, "Account name cannot exceed 50 characters"),
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
  isDefault: z.boolean().default(false),
});

const savedAccountTransferSchema = z.object({
  savedAccountId: z.string().min(1, "Please select a bank account"),
  amount: z
    .number()
    .min(1, "Amount must be at least 1")
    .max(500000, "Amount cannot exceed 500,000"),
});

interface SavedBankAccount {
  id: number;
  account_name: string;
  account_holder_name: string;
  iban: string;
  swift_bic: string;
  bank_name: string;
  bank_address?: string;
  currency: string;
  is_default: boolean;
}

export default function SendMoney() {
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<SavedBankAccount[]>([]);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

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
      cvv: "",
      cardNetwork: "Visa",
      currency: "EUR",
      amount: 1,
    },
  });

  const saveBankAccountForm = useForm<z.infer<typeof saveBankAccountSchema>>({
    resolver: zodResolver(saveBankAccountSchema),
    defaultValues: {
      accountName: "",
      accountHolderName: "",
      iban: "",
      swiftBic: "",
      bankName: "",
      bankAddress: "",
      currency: "EUR",
      isDefault: false,
    },
  });

  const savedAccountForm = useForm<z.infer<typeof savedAccountTransferSchema>>({
    resolver: zodResolver(savedAccountTransferSchema),
    defaultValues: {
      savedAccountId: "",
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

    async function fetchSavedAccounts() {
      if (!session?.user?.email) return;

      try {
        const accounts = (await sql`
          SELECT * FROM saved_bank_accounts
          WHERE user_email = ${session.user.email}
          ORDER BY is_default DESC, created_at DESC
        `) as SavedBankAccount[];

        setSavedAccounts(accounts);
      } catch (error) {
        console.error("Error fetching saved accounts:", error);
        toast.error("Failed to fetch saved accounts");
      }
    }

    fetchBalance();
    fetchSavedAccounts();
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
          cvv,
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
          ${values.cvv},
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

  async function onSaveBankAccount(
    values: z.infer<typeof saveBankAccountSchema>,
  ) {
    if (!session?.user?.email) return;

    try {
      // If this is set as default, unset other defaults first
      if (values.isDefault) {
        await sql`
          UPDATE saved_bank_accounts 
          SET is_default = false 
          WHERE user_email = ${session.user.email}
        `;
      }

      await sql`
        INSERT INTO saved_bank_accounts (
          user_email,
          account_name,
          account_holder_name,
          iban,
          swift_bic,
          bank_name,
          bank_address,
          currency,
          is_default
        ) VALUES (
          ${session.user.email},
          ${values.accountName},
          ${values.accountHolderName},
          ${values.iban},
          ${values.swiftBic},
          ${values.bankName},
          ${values.bankAddress || null},
          ${values.currency},
          ${values.isDefault}
        )
      `;

      // Refresh saved accounts
      const accounts = (await sql`
        SELECT * FROM saved_bank_accounts
        WHERE user_email = ${session.user.email}
        ORDER BY is_default DESC, created_at DESC
      `) as SavedBankAccount[];

      setSavedAccounts(accounts);
      setShowAddAccountForm(false);
      saveBankAccountForm.reset();
      toast.success("Bank account saved successfully");
    } catch (error) {
      console.error("Error saving bank account:", error);
      toast.error("Failed to save bank account");
    }
  }

  async function deleteSavedAccount(accountId: number) {
    if (!session?.user?.email) return;

    try {
      await sql`
        DELETE FROM saved_bank_accounts 
        WHERE id = ${accountId} AND user_email = ${session.user.email}
      `;

      setSavedAccounts((prev) =>
        prev.filter((account) => account.id !== accountId),
      );
      toast.success("Bank account deleted successfully");
    } catch (error) {
      console.error("Error deleting bank account:", error);
      toast.error("Failed to delete bank account");
    }
  }

  async function onSavedAccountTransfer(
    values: z.infer<typeof savedAccountTransferSchema>,
  ) {
    if (!session?.user?.email) return;

    if (values.amount > userBalance) {
      toast.error("Insufficient funds");
      return;
    }

    const selectedAccount = savedAccounts.find(
      (acc) => acc.id.toString() === values.savedAccountId,
    );
    if (!selectedAccount) {
      toast.error("Selected account not found");
      return;
    }

    try {
      // Insert into send_requests table
      await sql`
        INSERT INTO send_requests (
          user_email,
          user_name,
          "user",
          saved_bank_account_id,
          amount,
          currency,
          status
        ) VALUES (
          ${session.user.email},
          ${session.user.name || session.user.email},
          ${session.user.email},
          ${Number.parseInt(values.savedAccountId)},
          ${values.amount},
          ${selectedAccount.currency},
          false
        )
      `;

      // Update user balance
      await sql`
        UPDATE bank 
        SET balance = balance - ${values.amount}
        WHERE "user" = ${session.user.email}
      `;

      setUserBalance((prev) => prev - values.amount);
      toast.success("Transfer initiated successfully");
      savedAccountForm.reset();

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Transfer failed");
      savedAccountForm.reset();
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
      <DialogContent className="max-h-[80vh] max-w-md overflow-hidden overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Transfer funds via bank transfer, card payment, or saved accounts.
            Available balance: ${userBalance.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            <TabsTrigger value="card">Card Payment</TabsTrigger>
            <TabsTrigger value="saved">Saved Accounts</TabsTrigger>
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
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        3-4 digit security code on the back of your card.
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

          <TabsContent value="saved" className="space-y-4">
            {savedAccounts.length === 0 && !showAddAccountForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Saved Accounts</CardTitle>
                  <CardDescription>
                    You haven't saved any bank accounts yet. Add one to get
                    started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowAddAccountForm(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Bank Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {!showAddAccountForm && (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Send to Saved Account
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddAccountForm(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                      </Button>
                    </div>

                    <Form {...savedAccountForm}>
                      <form
                        onSubmit={savedAccountForm.handleSubmit(
                          onSavedAccountTransfer,
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={savedAccountForm.control}
                          name="savedAccountId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Bank Account</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a saved account" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {savedAccounts.map((account) => (
                                    <SelectItem
                                      key={account.id}
                                      value={account.id.toString()}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {account.account_name}
                                        </span>
                                        <span className="text-muted-foreground text-sm">
                                          {account.bank_name} •{" "}
                                          {account.iban.slice(-4)}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={savedAccountForm.control}
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
                                    const value = Number.parseFloat(
                                      e.target.value,
                                    );
                                    field.onChange(value);
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
                          disabled={
                            savedAccountForm.watch("amount") > userBalance
                          }
                        >
                          Send Funds
                        </Button>
                      </form>
                    </Form>

                    <div className="space-y-2">
                      <h4 className="font-medium">Manage Saved Accounts</h4>
                      {savedAccounts.map((account) => (
                        <Card key={account.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-medium">
                                    {account.account_name}
                                  </h5>
                                  {account.is_default && (
                                    <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {account.account_holder_name}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {account.bank_name} • {account.iban}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSavedAccount(account.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}

                {showAddAccountForm && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Add New Bank Account
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddAccountForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>

                    <Form {...saveBankAccountForm}>
                      <form
                        onSubmit={saveBankAccountForm.handleSubmit(
                          onSaveBankAccount,
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={saveBankAccountForm.control}
                          name="accountName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g., John's Business Account"
                                />
                              </FormControl>
                              <FormDescription>
                                A friendly name to identify this account.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveBankAccountForm.control}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveBankAccountForm.control}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveBankAccountForm.control}
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveBankAccountForm.control}
                          name="bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter bank name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveBankAccountForm.control}
                          name="bankAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bank Address (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter bank address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={saveBankAccountForm.control}
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
                                  <SelectItem value="EUR">
                                    EUR - Euro
                                  </SelectItem>
                                  <SelectItem value="USD">
                                    USD - US Dollar
                                  </SelectItem>
                                  <SelectItem value="GBP">
                                    GBP - British Pound
                                  </SelectItem>
                                  <SelectItem value="CHF">
                                    CHF - Swiss Franc
                                  </SelectItem>
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
                                Select the currency for the account.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center space-x-2">
                          <FormField
                            control={saveBankAccountForm.control}
                            name="isDefault"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mt-1"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Set as default account</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Save Bank Account
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
