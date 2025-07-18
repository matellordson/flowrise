"use client";

import * as React from "react";

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
