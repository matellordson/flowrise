import { TokenBTC } from "@web3icons/react";
import { ChevronLeft, ExternalLink, Globe, Twitter } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BTCBalance from "./balance";
import BTCChart, { BTCChartLight } from "./chart";
import { DepositDrawer } from "../deposit";
import { SendDrawer } from "../send";
import { SwapDrawer } from "../swap";
import { IconBrandTwitter } from "@tabler/icons-react";
import BTCChartDark from "./chart";

export default function BitcoinPage() {
  return (
    <div className="flex h-screen flex-col gap-x-3 gap-y-3 lg:flex-row">
      {/* nav */}
      <div className="bg-card h-full w-full space-y-5 rounded-xl p-3 lg:w-[50%]">
        <div className="flex items-center gap-x-2">
          <Link href={"/dashboard/crypto"}>
            <ChevronLeft size={30} />
          </Link>

          <div className="flex h-fit w-fit items-center justify-center rounded-full border p-1">
            <TokenBTC variant="mono" size={30} />
          </div>
          <div className="flex flex-col justify-center tracking-wide">
            <p className="font-semibold">Bitcoin</p>
            <p className="text-muted-foreground text-sm">BTC</p>
          </div>
        </div>
        <BTCBalance />
        <div className="flex items-center justify-around">
          <DepositDrawer />
          <SendDrawer />
          <SwapDrawer />
        </div>
        <div className="dark:hidden">
          <BTCChartLight />
        </div>
        <div className="hidden dark:block">
          <BTCChartDark />
        </div>
      </div>
      <div className="bg-card h-full w-full rounded-xl p-3 lg:w-[50%]">
        <Tabs defaultValue="about" className="h-fit w-fit">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="h-fit">
            <p className="text-primary/70 w-fit leading-7">
              Bitcoin (BTC) is the first cryptocurrency built on blockchain
              technology, also known as a decentralized digital currency that is
              based on cryptography. Unlike government-issued or fiat currencies
              such as US Dollars or Euro which are controlled by central banks,
              Bitcoin can operate without the need of a central authority like a
              central bank or a company. The decentralized nature allows it to
              operate on a peer-to-peer network whereby users are able to send
              funds to each other without going through intermediaries.
            </p>
            <a
              href="https://www.coingecko.com/en/coins/bitcoin"
              className="flex items-center gap-x-1 pt-2 text-sm text-[var(--brand)]"
              target="_blank"
            >
              Learn more <ExternalLink size={13} />
            </a>

            <div className="mt-4 flex items-center gap-x-4">
              <a
                href="https://bitcoin.org/en/"
                target="_blank"
                className="bg-muted text-muted-foreground flex h-fit w-fit items-center justify-center gap-x-1 rounded-xl px-2 py-1 text-sm tracking-wide"
              >
                Website <Globe size={15} />
              </a>
              <a
                href="https://x.com/Bitcoin"
                target="_blank"
                className="bg-muted text-muted-foreground flex h-fit w-fit items-center justify-center gap-x-1 rounded-xl px-2 py-1 text-sm tracking-wide"
              >
                Twitter <Twitter size={15} />
              </a>
            </div>
          </TabsContent>
          <TabsContent value="history">Coming soon...</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
