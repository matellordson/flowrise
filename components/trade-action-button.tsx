"use client";

import type React from "react";
import { useTransition, useState } from "react";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { executeTrade } from "@/actions/trading-actions";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface TradeActionButtonProps {
  signalId: string;
  children: React.ReactNode;
}

export function TradeActionButton({
  signalId,
  children,
}: TradeActionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await executeTrade(signalId);

        if (!result.success) {
          setStatus("error");
          toast("Unable to execute trade");
          setTimeout(() => setStatus("idle"), 2000);
        } else {
          setStatus("success");
          toast("Your trade has been successfully executed");
          setTimeout(() => setStatus("idle"), 1500);
        }
      } catch (error) {
        setStatus("error");
        toast("An unexpected error occurred");
        setTimeout(() => setStatus("idle"), 2000);
      }
    });
  };

  const getButtonContent = () => {
    if (isPending) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Executing...
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          Success!
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" />
          Failed
        </div>
      );
    }

    return children;
  };

  return (
    <form action={handleAction}>
      <AlertDialogAction
        type="submit"
        disabled={isPending || status !== "idle"}
        className={`transition-all duration-200 ${
          isPending || status !== "idle" ? "cursor-not-allowed opacity-70" : ""
        } ${status === "success" ? "bg-green-600 hover:bg-green-700" : ""} ${
          status === "error" ? "bg-red-600 hover:bg-red-700" : ""
        }`}
      >
        {getButtonContent()}
      </AlertDialogAction>
    </form>
  );
}
