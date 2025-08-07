import { TokenBNB, TokenBTC, TokenXRP } from "@web3icons/react";
import { ChevronLeft, ExternalLink, Globe, Twitter } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BTCBalance from "./balance";
import { XRPChartLight } from "./chart";
import XRPChartDark from "./chart";
import { DepositDrawer } from "../deposit";
import SendDrawer from "../send";
import SwapDrawer from "../swap";
import { IconBrandTwitter } from "@tabler/icons-react";
import BTCChartDark from "./chart";

export default function BNBPage() {
  return (
    <div className="flex h-screen flex-col gap-x-3 gap-y-3 lg:flex-row">
      {/* nav */}
      <div className="bg-card h-full w-full space-y-5 rounded-xl p-3 lg:w-[50%]">
        <div className="flex items-center gap-x-2">
          <Link href={"/dashboard/crypto"}>
            <ChevronLeft size={30} />
          </Link>

          <div className="flex h-fit w-fit items-center justify-center rounded-full border p-1">
            <TokenXRP variant="mono" size={30} />
          </div>
          <div className="flex flex-col justify-center tracking-wide">
            <p className="font-semibold">XRP</p>
            <p className="text-muted-foreground text-sm">XRP</p>
          </div>
        </div>
        <BTCBalance />
        <div className="flex items-center justify-around">
          <DepositDrawer />
          <SendDrawer />
          <SwapDrawer />
        </div>
        <div className="dark:hidden">
          <XRPChartLight />
        </div>
        <div className="hidden dark:block">
          <XRPChartDark />
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
              Ripple is a privately-held fintech company that provides a global
              payment solution via its patented payment network called Ripple
              Network (also known as RippleNet). RippleNet is a payment network
              that is built on top of Ripple’s consensus ledger, called XRP
              Ledger (also known as XRPL). Ripple funded the development of the
              open-source XRP Ledger. Unlike most cryptocurrencies out there
              that cater to peer-to-peer needs, Ripple was made to connect
              banks, payment providers and digital asset exchanges, enabling
              real-time settlement expeditions and lower transaction fees.
            </p>
            <a
              href="https://www.coingecko.com/en/coins/ripple"
              className="flex items-center gap-x-1 pt-2 text-sm text-[var(--brand)]"
              target="_blank"
            >
              Learn more <ExternalLink size={13} />
            </a>

            <div className="mt-4 flex items-center gap-x-4">
              <a
                href="https://xrpl.org/"
                target="_blank"
                className="bg-muted text-muted-foreground flex h-fit w-fit items-center justify-center gap-x-1 rounded-xl px-2 py-1 text-sm tracking-wide"
              >
                Website <Globe size={15} />
              </a>
              <a
                href="https://x.com/Ripple?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
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
