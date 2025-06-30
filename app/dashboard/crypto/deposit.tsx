"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import DepositBTC from "./deposit/coins/bitcoin";
import DepositETH from "./deposit/coins/ethereum";
import DepositSOL from "./deposit/coins/solana";
import DepositBNB from "./deposit/coins/binance";
import DepositUSDC from "./deposit/coins/usdc";
import DepositUSDT from "./deposit/coins/usdt";
import DepositXRP from "./deposit/coins/xrp";

export function DepositDrawer() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <QrCode />
            Deposit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit</DialogTitle>
            <DialogDescription>
              Make deposit to fund your investment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <DepositBTC />
            <DepositETH />
            <DepositSOL />
            <DepositBNB />
            <DepositUSDC />
            <DepositUSDT />
            <DepositXRP />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <QrCode />
          Deposit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Deposit</DrawerTitle>
          <DrawerDescription>
            Make deposit to fund your investment.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-wrap items-center justify-center gap-4 px-2">
          <DepositBTC />
          <DepositETH />
          <DepositSOL />
          <DepositBNB />
          <DepositUSDC />
          <DepositUSDT />
          <DepositXRP />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
