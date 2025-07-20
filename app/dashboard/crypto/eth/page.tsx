import { TokenBTC, TokenETH } from "@web3icons/react";
import { ChevronLeft, ExternalLink, Globe, Twitter } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ETHBalance from "./balance";
import { ETHChartLight, ETHChartDark } from "./chart";
import { DepositDrawer } from "../deposit";
import SendDrawer from "../send";
import SwapDrawer from "../swap";

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
            <TokenETH variant="mono" size={30} />
          </div>
          <div className="flex flex-col justify-center tracking-wide">
            <p className="font-semibold">Ethereum</p>
            <p className="text-muted-foreground text-sm">ETH</p>
          </div>
        </div>
        <ETHBalance />
        <div className="flex items-center justify-around">
          <DepositDrawer />
          <SendDrawer />
          <SwapDrawer />
        </div>
        <div className="dark:hidden">
          <ETHChartLight />
        </div>
        <div className="hidden dark:block">
          <ETHChartDark />
        </div>
      </div>
      <div className="lg:bg-card h-full w-full rounded-xl p-3 lg:w-[50%]">
        <Tabs defaultValue="about" className="h-fit w-fit">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="h-fit">
            <p className="text-primary/70 w-fit leading-7">
              Ethereum is a Proof-of-Stake blockchain that powers decentralized
              applications (dApps) through smart contracts, without being
              controlled by a centralized entity. As the first blockchain to
              feature smart contracts, it has the largest ecosystem of
              decentralized applications, ranging from decentralized exchanges
              to crypto lending and borrowing platforms and more. Ethereum is
              also home to numerous Layer 2 solutions that offer users a cheaper
              and faster way to process transactions on the blockchain. Some of
              these solutions include Arbitrum, which rolls up multiple
              transactions into a single transaction on Ethereum, and Polygon’s
              Proof-of-Stake chain, which is a sidechain that runs parallel to
              the Ethereum blockchain.
            </p>
            <a
              href="https://www.coingecko.com/en/coins/ethereum"
              className="flex items-center gap-x-1 pt-2 text-sm text-[var(--brand)]"
              target="_blank"
            >
              Learn more <ExternalLink size={13} />
            </a>

            <div className="mt-4 flex items-center gap-x-4">
              <a
                href="https://ethereum.org/en"
                target="_blank"
                className="bg-muted text-muted-foreground flex h-fit w-fit items-center justify-center gap-x-1 rounded-xl px-2 py-1 text-sm tracking-wide"
              >
                Website <Globe size={15} />
              </a>
              <a
                href="https://x.com/ethereum?"
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
