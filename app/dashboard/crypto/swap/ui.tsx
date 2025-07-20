"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  Loader2,
  TrendingUp,
  RefreshCw,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============================================================================
// COIN ICON IMPORTS - Import actual icon components for each coin
// ============================================================================
import {
  TokenBNB,
  TokenBTC,
  TokenETH,
  TokenSOL,
  TokenUSDC,
  TokenUSDT,
  TokenXRP,
} from "@web3icons/react";

// ============================================================================
// TYPES & INTERFACES - Customize these based on your database schema
// ============================================================================

interface Coin {
  id: number;
  symbol: string;
  name: string;
  price: number;
  balance: number;
  decimals: number;
  coingecko_id: string;
  icon_name: string;
  created_at?: string;
  updated_at?: string;
}

interface SwapQuote {
  from_coin: string;
  to_coin: string;
  from_amount: string;
  to_amount: string;
  exchange_rate: number;
  price_impact: number;
  estimated_gas: string;
}

interface SwapResult {
  success: boolean;
  transaction_id: string;
  from_coin: string;
  to_coin: string;
  from_amount: string;
  received_amount: string;
  actual_slippage: string;
  gas_used: string;
  timestamp: string;
}

// ============================================================================
// ICON COMPONENT MAPPER - Maps coin symbol to actual React component
// ============================================================================
const IconComponents = {
  BTC: TokenBTC,
  ETH: TokenETH,
  SOL: TokenSOL,
  BNB: TokenBNB,
  USDC: TokenUSDC,
  USDT: TokenUSDT,
  XRP: TokenXRP,
} as const;

// ============================================================================
// UTILITY FUNCTIONS - Customize number formatting as needed
// ============================================================================

function formatNumber(num: number, decimals = 4): string {
  if (num === 0) return "0";
  if (num < 0.0001) return num.toExponential(2);
  if (num < 1) return num.toFixed(decimals);
  if (num < 1000) return num.toFixed(2);
  if (num < 100000) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  if (num < 1000000) return (num / 1000).toFixed(0) + "K";
  if (num < 1000000000) return (num / 1000000).toFixed(1) + "M";
  return (num / 1000000000).toFixed(1) + "B";
}

function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  if (price < 100000) {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `$${formatNumber(price)}`;
}

// ============================================================================
// COIN ICON COMPONENT - Uses imported React icon components
// ============================================================================
function CoinIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  // Get the icon component from the mapping
  const IconComponent = IconComponents[symbol as keyof typeof IconComponents];

  // If no icon component found, show fallback
  if (!IconComponent) {
    return (
      <div
        className="bg-muted text-muted-foreground flex items-center justify-center rounded-full text-xs font-medium"
        style={{ width: size, height: size }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  // Render the actual icon component
  return (
    <IconComponent
      size={size}
      variant="mono" // Use monochrome variant for consistency
      className="rounded-full"
    />
  );
}

// ============================================================================
// COIN SELECTOR COMPONENT - Customize dropdown behavior
// ============================================================================
function CoinSelector({
  selectedCoin,
  onCoinSelect,
  excludeCoin,
  coins,
}: {
  selectedCoin: Coin | null;
  onCoinSelect: (coin: Coin) => void;
  excludeCoin?: Coin | null;
  coins: Coin[];
}) {
  const [open, setOpen] = useState(false);
  const availableCoins = coins.filter(
    (coin) => !excludeCoin || coin.symbol !== excludeCoin.symbol,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-background/50 border-border/50 hover:bg-background/80 h-11 min-w-[140px] justify-between backdrop-blur-sm transition-all duration-200"
        >
          {selectedCoin ? (
            <div className="flex items-center gap-2.5">
              <CoinIcon symbol={selectedCoin.symbol} size={20} />
              <span className="text-sm font-semibold">
                {selectedCoin.symbol}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Select</span>
          )}
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-border/50 bg-background/95 w-[340px] p-0 backdrop-blur-sm">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search coins..."
            className="h-12 border-0 bg-transparent"
          />
          <CommandList className="max-h-[320px]">
            <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
              No coin found.
            </CommandEmpty>
            <CommandGroup className="p-2">
              {availableCoins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={`${coin.symbol} ${coin.name}`}
                  onSelect={() => {
                    onCoinSelect(coin);
                    setOpen(false);
                  }}
                  className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <CoinIcon symbol={coin.symbol} size={32} />
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold">{coin.symbol}</div>
                      <div className="text-muted-foreground max-w-[120px] truncate text-xs">
                        {coin.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <div className="text-sm font-medium">
                      {formatPrice(coin.price)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatNumber(coin.balance)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// SWAP SETTINGS COMPONENT - Customize slippage options
// ============================================================================
function SwapSettings({
  slippage,
  onSlippageChange,
}: {
  slippage: number;
  onSlippageChange: (slippage: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState(slippage.toString());

  // Customize these preset values as needed
  const PRESET_SLIPPAGE = [0.1, 0.5, 1.0, 3.0];

  const handlePresetSlippage = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage(value.toString());
  };

  const handleCustomSlippage = (value: string) => {
    setCustomSlippage(value);
    const numValue = Number.parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSlippageChange(numValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-muted/50 h-9 w-9 rounded-lg p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background/95 border-border/50 backdrop-blur-sm sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Swap Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Adjust your swap preferences and slippage tolerance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Slippage Tolerance</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_SLIPPAGE.map((preset) => (
                <Button
                  key={preset}
                  variant={slippage === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetSlippage(preset)}
                  className="h-10 font-semibold"
                >
                  {preset}%
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => handleCustomSlippage(e.target.value)}
                className="bg-muted/30 border-border/50 h-10 pr-8"
                min="0"
                max="50"
                step="0.1"
              />
              <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium">
                %
              </span>
            </div>
            {slippage > 5 && (
              <div className="bg-destructive/10 border-destructive/20 flex items-center gap-2 rounded-lg border p-3">
                <Badge variant="destructive" className="font-semibold">
                  High Slippage
                </Badge>
                <span className="text-muted-foreground text-sm">
                  Your transaction may be frontrun
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN SWAP COMPONENT - Customize UI layout and behavior
// ============================================================================
export default function SwapUI() {
  // State management
  const [coins, setCoins] = useState<Coin[]>([]);
  const [fromCoin, setFromCoin] = useState<Coin | null>(null);
  const [toCoin, setToCoin] = useState<Coin | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [priceImpact, setPriceImpact] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ============================================================================
  // FETCH COINS FROM DATABASE - Customize this endpoint
  // ============================================================================
  const fetchCoins = useCallback(async () => {
    try {
      const response = await fetch("/api/coins");
      if (!response.ok) throw new Error("Failed to fetch coins");

      const data = await response.json();
      setCoins(data.coins);
      setLastUpdated(new Date(data.timestamp));

      // Auto-select first two coins if none selected
      if (!fromCoin && !toCoin && data.coins.length >= 2) {
        setFromCoin(
          data.coins.find((c: Coin) => c.symbol === "BTC") || data.coins[0],
        );
        setToCoin(
          data.coins.find((c: Coin) => c.symbol === "ETH") || data.coins[1],
        );
      }
    } catch (error) {
      console.error("Failed to fetch coins:", error);
      toast.error("Failed to load coin data");
    }
  }, [fromCoin, toCoin]);

  // ============================================================================
  // GET SWAP QUOTE - Customize quote calculation
  // ============================================================================
  const fetchSwapQuote = useCallback(async () => {
    if (
      !fromCoin ||
      !toCoin ||
      !fromAmount ||
      Number.parseFloat(fromAmount) <= 0
    ) {
      setToAmount("");
      setExchangeRate(null);
      setPriceImpact(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/swap/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_coin_id: fromCoin.id,
          to_coin_id: toCoin.id,
          amount: fromAmount,
        }),
      });

      if (!response.ok) throw new Error("Failed to get quote");

      const quote: SwapQuote = await response.json();
      setToAmount(quote.to_amount);
      setExchangeRate(quote.exchange_rate);
      setPriceImpact(quote.price_impact);
    } catch (error) {
      console.error("Quote error:", error);
      toast.error("Failed to get swap quote");
    } finally {
      setIsLoading(false);
    }
  }, [fromCoin, toCoin, fromAmount]);

  // ============================================================================
  // EXECUTE SWAP - Customize swap execution and database updates
  // ============================================================================
  const executeSwap = useCallback(async () => {
    if (
      !fromCoin ||
      !toCoin ||
      !fromAmount ||
      Number.parseFloat(fromAmount) <= 0
    ) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (Number.parseFloat(fromAmount) > fromCoin.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSwapping(true);
    try {
      const response = await fetch("/api/swap/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_coin_id: fromCoin.id,
          to_coin_id: toCoin.id,
          from_amount: fromAmount,
          to_amount: toAmount,
          slippage: slippage,
          user_id: 1, // Replace with actual user ID from auth
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Swap failed");
      }

      const result: SwapResult = await response.json();
      toast.success(
        `Successfully swapped ${fromAmount} ${fromCoin.symbol} for ${result.received_amount} ${toCoin.symbol}`,
      );

      // Reset form and refresh balances
      setFromAmount("");
      setToAmount("");
      setExchangeRate(null);
      setPriceImpact(0);
      fetchCoins(); // Refresh balances from database
    } catch (error: any) {
      console.error("Swap error:", error);
      toast.error(error.message || "Swap failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  }, [fromCoin, toCoin, fromAmount, toAmount, slippage, fetchCoins]);

  // Swap coin positions
  const swapCoins = useCallback(() => {
    const tempCoin = fromCoin;
    const tempAmount = fromAmount;
    setFromCoin(toCoin);
    setToCoin(tempCoin);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  }, [fromCoin, toCoin, fromAmount, toAmount]);

  // Auto-fetch quote when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(fetchSwapQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchSwapQuote]);

  // Load coins on mount and refresh every minute
  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, [fetchCoins]);

  // ============================================================================
  // RENDER UI - Customize layout and styling
  // ============================================================================
  return (
    <main className="">
      <div className="">
        {/* Swap Card */}
        <div className="border-0 p-0">
          <div className="space-y-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                Swap Coins
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchCoins}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
                <SwapSettings
                  slippage={slippage}
                  onSlippageChange={setSlippage}
                />
              </div>
            </div>
            {lastUpdated && (
              <p className="text-muted-foreground text-xs">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <CardContent className="space-y-1 px-0">
            {/* From Coin Input */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-sm font-medium">
                From
              </Label>
              <div className="bg-muted/30 border-border/50 focus-within:border-primary/50 flex items-center rounded-xl border transition-colors duration-200">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="h-[3rem] flex-1 border-0 bg-transparent px-4 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="">
                  <CoinSelector
                    selectedCoin={fromCoin}
                    onCoinSelect={setFromCoin}
                    excludeCoin={toCoin}
                    coins={coins}
                  />
                </div>
              </div>
              {fromCoin && (
                <div className="flex justify-between px-1 text-sm">
                  <span className="text-muted-foreground">
                    Balance: {formatNumber(fromCoin.balance)} {fromCoin.symbol}
                  </span>
                  <span className="font-medium">
                    {formatPrice(
                      fromCoin.price * Number.parseFloat(fromAmount || "0"),
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={swapCoins}
                className="hover:bg-primary/10 hover:text-primary border-border/50 h-10 w-10 rounded-full border p-3 transition-all duration-200"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Coin Input */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-sm font-medium">
                To
              </Label>
              <div className="bg-muted/30 border-border/50 flex items-center rounded-xl border">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="text-muted-foreground h-[3rem] flex-1 border-0 bg-transparent px-4 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="">
                  <CoinSelector
                    selectedCoin={toCoin}
                    onCoinSelect={setToCoin}
                    excludeCoin={fromCoin}
                    coins={coins}
                  />
                </div>
              </div>
              {toCoin && toAmount && (
                <div className="flex justify-between px-1 text-sm">
                  <span className="text-muted-foreground">
                    Balance: {formatNumber(toCoin.balance)} {toCoin.symbol}
                  </span>
                  <span className="font-medium">
                    {formatPrice(
                      toCoin.price * Number.parseFloat(toAmount || "0"),
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Exchange Rate Info */}
            {exchangeRate && fromCoin && toCoin && (
              <div className="space-y-4 pt-4">
                <Separator className="bg-border/50" />
                <div className="bg-muted/20 space-y-3 rounded-lg p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">
                      Exchange Rate
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        1 {fromCoin.symbol} = {formatNumber(exchangeRate)}{" "}
                        {toCoin.symbol}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchSwapQuote}
                        className="hover:bg-primary/10 h-7 w-7 p-0"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">
                      Price Impact
                    </span>
                    <Badge
                      variant={
                        priceImpact > 3
                          ? "destructive"
                          : priceImpact > 1
                            ? "secondary"
                            : "default"
                      }
                      className="font-semibold"
                    >
                      {priceImpact.toFixed(2)}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">
                      Slippage Tolerance
                    </span>
                    <span className="font-semibold">{slippage}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Execute Swap Button */}
            <div className="pt-4">
              <Button
                onClick={executeSwap}
                disabled={
                  !fromAmount ||
                  !fromCoin ||
                  !toCoin ||
                  isSwapping ||
                  Number.parseFloat(fromAmount) <= 0
                }
                className="w-full"
                size="lg"
              >
                {isSwapping ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Swap...
                  </>
                ) : (
                  <>Swap Coins</>
                )}
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </main>
  );
}
