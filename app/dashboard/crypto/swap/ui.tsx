"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  Loader2,
  TrendingUp,
  RefreshCw,
  Settings,
  Coins,
  AlertCircle,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// ============================================================================
// TYPES & INTERFACES - Customize these based on your database schema
// ============================================================================

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

interface SwapQuote {
  from_coin_id: string;
  to_coin_id: string;
  input_amount: string;
  output_amount: string;
  exchange_rate: number;
  fee: string;
  fee_percentage: number;
  price_impact: number;
  minimum_received: string;
  quote_id: string;
  expires_at: string;
}

interface SwapResult {
  success: boolean;
  transaction_hash: string;
  from_coin_id: string;
  to_coin_id: string;
  input_amount: string;
  actual_output: string;
  fee_paid: string;
  timestamp: string;
  block_number: number;
  gas_used: number;
}

interface CoinBalance {
  coin_id: string;
  balance: number; // Amount of coins user owns
  usd_value: number; // Current USD value of the balance
}

// ============================================================================
// UTILITY FUNCTIONS - Customize number formatting as needed
// ============================================================================

function formatNumber(num: number, decimals = 4): string {
  if (typeof num !== "number" || isNaN(num)) {
    return "0.00";
  }
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
// COIN ICON COMPONENT - Using coin images instead of web3icons
// ============================================================================
function CoinIcon({ coin, size = 24 }: { coin: Coin; size?: number }) {
  return (
    <div className="relative">
      <img
        src={coin.image || "/placeholder.svg"}
        alt={coin.name}
        width={size}
        height={size}
        className="rounded-full"
        onError={(e) => {
          // Fallback to text-based icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div
        className="bg-muted text-muted-foreground absolute inset-0 hidden items-center justify-center rounded-full text-xs font-medium"
        style={{ width: size, height: size }}
      >
        {coin.symbol.slice(0, 2).toUpperCase()}
      </div>
    </div>
  );
}

// ============================================================================
// COIN SELECTOR COMPONENT - Improved responsive design
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
    (coin) => !excludeCoin || coin.id !== excludeCoin.id,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-background/50 border-border/50 hover:bg-background/80 h-12 min-w-[120px] justify-between backdrop-blur-sm transition-all duration-200 sm:min-w-[140px]"
        >
          {selectedCoin ? (
            <div className="flex items-center gap-2">
              <CoinIcon coin={selectedCoin} size={20} />
              <span className="truncate text-sm font-semibold">
                {selectedCoin.symbol}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Select</span>
          )}
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-border/50 bg-background/95 w-[90vw] p-0 backdrop-blur-sm sm:w-[340px]">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search coins..."
            className="h-12 border-0 bg-transparent"
          />
          <CommandList className="max-h-[280px] sm:max-h-[320px]">
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
                  className="hover:bg-muted/50 flex min-h-[60px] cursor-pointer items-center justify-between rounded-lg p-3 transition-colors duration-150 sm:p-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <CoinIcon coin={coin} size={32} />
                    <div className="flex min-w-0 flex-col">
                      <div className="text-sm font-semibold">{coin.symbol}</div>
                      <div className="text-muted-foreground truncate text-xs">
                        {coin.name}
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 flex flex-col items-end text-right">
                    <div className="text-sm font-medium">
                      {formatPrice(coin.current_price)}
                    </div>
                    <div
                      className={`text-xs ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                      {coin.price_change_percentage_24h.toFixed(2)}%
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
      <DialogContent className="max-h-[80vh] max-w-[90vw] overflow-y-auto sm:max-w-md">
        <DialogHeader className="space-y-3">
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
// MAIN SWAP COMPONENT - Improved responsive layout and cleaner design
// ============================================================================
export default function SwapPage() {
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
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [userBalances, setUserBalances] = useState<CoinBalance[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState(false);

  const fetchUserBalances = useCallback(async () => {
    setBalancesLoading(true);
    try {
      const response = await fetch("/api/balances");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (errorData.needsSetup) {
          setSetupNeeded(true);
          console.log("[v0] Database setup needed:", errorData.message);
          setUserBalances([]);
          return;
        }

        throw new Error(errorData.error || "Failed to fetch balances");
      }

      const data = await response.json();

      if (!data.success) {
        if (data.needsSetup) {
          setSetupNeeded(true);
          console.log("[v0] Database setup needed:", data.message);
          setUserBalances([]);
          return;
        }
        throw new Error(data.error || "Failed to fetch balances");
      }

      setSetupNeeded(false);
      console.log("[v0] Fetched balances successfully:", data.balances);

      // Convert database response to CoinBalance format
      const balances: CoinBalance[] = data.balances.map((balance: any) => ({
        coin_id:
          balance.coin_symbol.toLowerCase() === "btc"
            ? "bitcoin"
            : balance.coin_symbol.toLowerCase() === "eth"
              ? "ethereum"
              : balance.coin_symbol.toLowerCase() === "bnb"
                ? "binancecoin"
                : balance.coin_symbol.toLowerCase() === "sol"
                  ? "solana"
                  : balance.coin_symbol.toLowerCase() === "ada"
                    ? "cardano"
                    : balance.coin_symbol.toLowerCase() === "xrp"
                      ? "ripple"
                      : balance.coin_symbol.toLowerCase() === "usdc"
                        ? "usd-coin"
                        : balance.coin_symbol.toLowerCase() === "usdt"
                          ? "tether"
                          : balance.coin_symbol.toLowerCase(),
        balance: balance.balance,
        usd_value: balance.usd_value,
      }));

      setUserBalances(balances);
    } catch (error: any) {
      console.error("[v0] Failed to fetch user balances:", error.message);
      setUserBalances([]);
    } finally {
      setBalancesLoading(false);
    }
  }, []);

  const validateBalance = useCallback(() => {
    if (!fromCoin || !fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setBalanceError(null);
      return;
    }

    const userBalance = userBalances.find((b) => b.coin_id === fromCoin.id);
    if (!userBalance) {
      setBalanceError("No balance found for this coin");
      return;
    }

    const requestedCoinAmount = Number.parseFloat(fromAmount);
    const requestedUsdValue = requestedCoinAmount * fromCoin.current_price;
    const availableUsdValue = userBalance.usd_value; // Database stores USD values directly

    console.log("[v0] Balance validation:", {
      coin: fromCoin.symbol,
      requestedCoinAmount,
      requestedUsdValue,
      availableUsdValue,
      availableCoinAmount: userBalance.balance,
    });

    // Compare USD values for accurate validation
    if (requestedUsdValue > availableUsdValue) {
      setBalanceError(
        `Insufficient ${fromCoin.symbol} balance. Available: ${userBalance.balance.toFixed(4)} ${fromCoin.symbol} (${formatPrice(availableUsdValue)})`,
      );
      return;
    }

    setBalanceError(null);
  }, [fromCoin, fromAmount, userBalances]);

  useEffect(() => {
    validateBalance();
  }, [validateBalance]);

  // ============================================================================
  // FETCH COINS FROM DATABASE - Updated to match API response structure
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
  // GET SWAP QUOTE - Updated to match API response structure
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

    if (balanceError) {
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
      setToAmount(quote.output_amount);
      setExchangeRate(quote.exchange_rate);
      setPriceImpact(quote.price_impact);
    } catch (error) {
      console.error("Quote error:", error);
      toast.error("Failed to get swap quote");
    } finally {
      setIsLoading(false);
    }
  }, [fromCoin, toCoin, fromAmount, balanceError]);

  // ============================================================================
  // EXECUTE SWAP - Updated to match API response structure
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

    setIsSwapping(true);
    try {
      const response = await fetch("/api/swap/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote_id: `quote_${Date.now()}`,
          from_coin_id: fromCoin.id,
          to_coin_id: toCoin.id,
          input_amount: fromAmount,
          expected_output: toAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Swap failed");
      }

      const result: SwapResult = await response.json();
      toast.success(
        `Successfully swapped ${fromAmount} ${fromCoin.symbol} for ${result.actual_output} ${toCoin.symbol}`,
      );

      // Reset form and refresh balances
      setFromAmount("");
      setToAmount("");
      setExchangeRate(null);
      setPriceImpact(0);
      fetchCoins();
      fetchUserBalances();
    } catch (error: any) {
      console.error("Swap error:", error);
      toast.error(error.message || "Swap failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  }, [fromCoin, toCoin, fromAmount, toAmount, fetchCoins, fetchUserBalances]);

  // Auto-fetch quote when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(fetchSwapQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchSwapQuote]);

  useEffect(() => {
    fetchCoins();
    fetchUserBalances();
    const interval = setInterval(() => {
      fetchCoins();
      fetchUserBalances();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchCoins, fetchUserBalances]);

  // ============================================================================
  // RENDER UI - Cleaner, more responsive layout
  // ============================================================================
  return (
    <main className="flex h-[80vh] max-w-full items-center justify-center overflow-scroll px-4">
      <div className="w-full max-w-lg space-y-6">
        {setupNeeded && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Please complete these steps to use the swap functionality:</p>
              <ol className="ml-4 list-decimal space-y-1 text-sm">
                <li>Click the gear icon (⚙️) in the top right</li>
                <li>Go to "Integrations" and add Neon</li>
                <li>Run the SQL scripts in the /scripts folder</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-background rounded-2xl p-0 shadow-xl backdrop-blur-sm sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6" />
                Swap Coins
              </CardTitle>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchCoins}
                  disabled={isLoading || balancesLoading}
                  className="hover:bg-muted/50 h-8 w-8 p-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading || balancesLoading ? "animate-spin" : ""}`}
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

            <div className="space-y-4">
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
                    className="h-14 flex-1 border-0 bg-transparent px-3 text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-16 sm:px-4 sm:text-xl"
                  />
                  <div className="pr-2 sm:pr-3">
                    <CoinSelector
                      selectedCoin={fromCoin}
                      onCoinSelect={setFromCoin}
                      excludeCoin={toCoin}
                      coins={coins}
                    />
                  </div>
                </div>
                {fromCoin && (
                  <div className="flex items-center justify-between px-1 text-sm">
                    <span className="text-muted-foreground">
                      {formatPrice(fromCoin.current_price)}
                    </span>
                    <span className="font-medium">
                      {formatPrice(
                        fromCoin.current_price *
                          Number.parseFloat(fromAmount || "0"),
                      )}
                    </span>
                  </div>
                )}
                {fromCoin && (
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="text-muted-foreground">
                      Balance:{" "}
                      {balancesLoading
                        ? "Loading..."
                        : `${userBalances.find((b) => b.coin_id === fromCoin.id)?.balance.toFixed(4) || "0.0000"} ${fromCoin.symbol}`}
                    </span>
                    <span className="text-muted-foreground">
                      {balancesLoading
                        ? "..."
                        : formatPrice(
                            userBalances.find((b) => b.coin_id === fromCoin.id)
                              ?.usd_value || 0,
                          )}
                    </span>
                  </div>
                )}
                {balanceError && (
                  <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-2 text-sm font-medium">
                    {balanceError}
                  </div>
                )}
              </div>

              <div className="flex justify-center py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const tempCoin = fromCoin;
                    const tempAmount = fromAmount;
                    setFromCoin(toCoin);
                    setToCoin(tempCoin);
                    setFromAmount(toAmount);
                    setToAmount(tempAmount);
                  }}
                  className="hover:bg-primary/10 hover:text-primary border-border/50 h-12 w-12 rounded-full border p-3 transition-all duration-200"
                >
                  <ArrowUpDown className="h-5 w-5" />
                </Button>
              </div>

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
                    className="text-muted-foreground h-14 flex-1 border-0 bg-transparent px-3 text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-16 sm:px-4 sm:text-xl"
                  />
                  <div className="pr-2 sm:pr-3">
                    <CoinSelector
                      selectedCoin={toCoin}
                      onCoinSelect={setToCoin}
                      excludeCoin={fromCoin}
                      coins={coins}
                    />
                  </div>
                </div>
                {toCoin && toAmount && (
                  <div className="flex items-center justify-between px-1 text-sm">
                    <span className="text-muted-foreground">
                      {formatPrice(toCoin.current_price)}
                    </span>
                    <span className="font-medium">
                      {formatPrice(
                        toCoin.current_price *
                          Number.parseFloat(toAmount || "0"),
                      )}
                    </span>
                  </div>
                )}
              </div>

              {exchangeRate && fromCoin && toCoin && (
                <div className="space-y-4 pt-4">
                  <Separator className="bg-border/50" />
                  <div className="bg-muted/20 space-y-3 rounded-lg p-3 text-sm sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground font-medium">
                        Exchange Rate
                      </span>
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-right font-semibold">
                          1 {fromCoin.symbol} = {formatNumber(exchangeRate)}{" "}
                          {toCoin.symbol}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={fetchSwapQuote}
                          className="hover:bg-primary/10 h-7 w-7 shrink-0 p-0"
                          disabled={isLoading || balancesLoading}
                        >
                          {isLoading || balancesLoading ? (
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

              <div className="pt-4">
                <Button
                  onClick={executeSwap}
                  disabled={
                    !fromAmount ||
                    !fromCoin ||
                    !toCoin ||
                    isSwapping ||
                    Number.parseFloat(fromAmount) <= 0 ||
                    !!balanceError ||
                    balancesLoading ||
                    setupNeeded
                  }
                  className="h-12 w-full text-base font-semibold sm:h-14"
                  size="lg"
                >
                  {setupNeeded ? (
                    <>Setup Required</>
                  ) : isSwapping ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Swap...
                    </>
                  ) : balanceError ? (
                    <>Insufficient Balance</>
                  ) : balancesLoading ? (
                    <>Loading Balances...</>
                  ) : (
                    <>Swap Coins</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
