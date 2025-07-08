import { TokenBTC, TokenSOL } from "@web3icons/react";
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
            <TokenSOL variant="mono" size={30} />
          </div>
          <div className="flex flex-col justify-center tracking-wide">
            <p className="font-semibold">Solana</p>
            <p className="text-muted-foreground text-sm">SOL</p>
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
      <div className="lg:bg-card h-full w-fit rounded-xl p-3 lg:w-[50%]">
        <Tabs defaultValue="about" className="h-fit w-fit">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="h-fit">
            <p className="text-primary/70 w-fit leading-7">
              Solana is a Layer 1 blockchain that offers users fast speeds and
              affordable costs. It supports smart contracts and facilitates the
              creation of decentralized applications (dApps). Projects built on
              Solana include a variety of DeFi platforms as well as NFT
              marketplaces, where users can buy Solana-based NFT projects. Its
              high performance means Solana doesn’t require a traditional
              scaling Layer 2 solution; instead, Layer 2s on Solana focus on
              interoperability and connecting Solana to other chains. Solana
              combines the Proof-of-History (PoH) consensus mechanism alongside
              the more common Proof-of-Stake. This ensures Solana achieves
              consensus more quickly while reducing the workload and solving the
              blockchain trilemma, where developers have to balance
              decentralization, security, and scalability.
            </p>
            <a
              href="https://www.coingecko.com/en/coins/solana"
              className="flex items-center gap-x-1 pt-2 text-sm text-[var(--brand)]"
              target="_blank"
            >
              Learn more <ExternalLink size={13} />
            </a>

            <div className="mt-4 flex items-center gap-x-4">
              <a
                href="https://solana.com"
                target="_blank"
                className="bg-muted text-muted-foreground flex h-fit w-fit items-center justify-center gap-x-1 rounded-xl px-2 py-1 text-sm tracking-wide"
              >
                Website <Globe size={15} />
              </a>
              <a
                href="https://x.com/solana?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
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
