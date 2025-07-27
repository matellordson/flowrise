"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  OctagonAlert,
  Sprout,
  TreeDeciduous,
  Trees,
} from "lucide-react";
import { sql } from "@/lib/sql";

// Mock component for demonstration
const BankDepositAccounts = () => <div>Bank deposit accounts component</div>;

// Updated schema with proper number validation
const formSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
});

type FormData = z.infer<typeof formSchema>;

export default function TradingPlans() {
  const { data: session } = useSession();
  const router = useRouter();

  // Create separate form instances for each plan
  const miniForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 10000,
    },
  });

  const proForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 25000,
    },
  });

  const maxForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50000,
    },
  });

  async function handlePlanSubmission(
    values: FormData,
    planType: "mini" | "pro" | "max",
    form: typeof miniForm,
  ) {
    try {
      if (!session?.user?.email) {
        toast.error("User email not found. Please log in again.");
        return;
      }

      console.log("Attempting to insert:", {
        user: session.user.email,
        plan: planType,
        amount: values.amount,
      });

      const result = await sql`
        INSERT INTO trading_deposit ("user", plan, amount) 
        VALUES (${session.user.email}, ${planType}, ${values.amount})
        RETURNING *
      `;

      console.log("Insert result:", result);

      toast.success(
        "Plan selected successfully! Please proceed to making deposit",
      );
      form.reset();
      router.push("/dashboard/trading");
    } catch (error) {
      console.error("Database error details:", error);
      toast.error(`Failed to select plan: ${error || "Unknown error"}`);
    }
  }

  const PlanCard = ({
    icon: Icon,
    title,
    minAmount,
    maxAmount,
    description,
    form,
    planType,
    variant = "default",
  }: {
    icon: any;
    title: string;
    minAmount: string;
    maxAmount: string;
    description: string;
    form: typeof miniForm;
    planType: "mini" | "pro" | "max";
    variant?: "default" | "outline";
  }) => (
    <div className="h-fit w-[18.5rem] rounded-xl border p-3">
      <Icon className="mb-1" />
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-tight flex items-end gap-x-2 font-mono">
        <span className="text-2xl font-semibold">{minAmount}</span>
        <ArrowRight size={22} className="stroke-muted-foreground" />
        <span className="">{maxAmount}</span>
      </p>
      <p className="text-muted-foreground pt-2 text-sm">{description}</p>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant={variant as any}
            className="mt-3 w-full"
            size="sm"
          >
            Select plan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fund your account</DialogTitle>
            <DialogDescription>
              Select a deposit account and enter the amount you want to deposit.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <OctagonAlert className="h-4 w-4" />
            <AlertTitle className="font-semibold">
              Deposit Instructions
            </AlertTitle>
            <AlertDescription>
              Please select any of the provided deposit accounts and pay then
              come back to fill the amount form. Your trading account will be
              funded within 24 hours of payment confirmation.
            </AlertDescription>
          </Alert>

          <BankDepositAccounts />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                handlePlanSubmission(values, planType, form),
              )}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        min={
                          planType === "mini"
                            ? 10000
                            : planType === "pro"
                              ? 25000
                              : 50000
                        }
                        max={
                          planType === "mini"
                            ? 10000
                            : planType === "pro"
                              ? 25000
                              : 50000
                        }
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Handle empty string and convert to number
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the amount you have deposited.
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
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3">
      <PlanCard
        icon={Sprout}
        title="Mini plan"
        minAmount="$10,000"
        maxAmount="$35,000"
        description="Investment plan for new traders"
        form={miniForm}
        planType="mini"
        variant="outline"
      />

      <PlanCard
        icon={TreeDeciduous}
        title="Pro plan"
        minAmount="$25,000"
        maxAmount="$78,000"
        description="Investment plan for experienced traders"
        form={proForm}
        planType="pro"
      />

      <PlanCard
        icon={Trees}
        title="Max plan"
        minAmount="$50,000"
        maxAmount="$160,000"
        description="Investment plan for expert traders"
        form={maxForm}
        planType="max"
        variant="outline"
      />
    </div>
  );
}
