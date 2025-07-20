"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OctagonAlert, Send, RefreshCw, Replace } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import SwapUI from "./swap/ui";

export default function SwapDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Replace className="mr-2 h-4 w-4" />
          Swap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <SwapUI />
      </DialogContent>
    </Dialog>
  );
}
