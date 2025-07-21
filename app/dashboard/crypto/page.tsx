import Coins from "./coins";
import { DepositDrawer } from "./deposit";
import SwapDrawer from "./swap";
import { sql } from "@/lib/sql";
import { auth } from "@/auth";
import getCryptoNews from "./(news)/api";
import Link from "next/link";
import Image from "next/image";
import SendDrawer from "./send";

interface newsTypes {
  id: string;
  title: string;
  imgUrl: string;
  source: string;
  link: string;
}

export default async function CryptoDashboard() {
  const news = await getCryptoNews();
  const session = await auth();
  // const totalBalance = await sql`
  // SELECT
  //   (SELECT COALESCE(SUM(amount), 0) FROM bitcoin) +
  //   (SELECT COALESCE(SUM(amount), 0) FROM ethereum) +
  //   (SELECT COALESCE(SUM(amount), 0) FROM solana) AS total_amount;
  // `;

  const totalAmount = await sql`
SELECT 
  (SELECT COALESCE(SUM(amount), 0) FROM bitcoin WHERE "user" = ${session?.user?.email}) + (SELECT COALESCE(SUM(amount), 0) FROM ethereum WHERE "user" = ${session?.user?.email}) + (SELECT COALESCE(SUM(amount), 0) FROM solana WHERE "user" = ${session?.user?.email}) + (SELECT COALESCE(SUM(amount), 0) FROM bnb WHERE "user" = ${session?.user?.email}) + (SELECT COALESCE(SUM(amount), 0) FROM usdc WHERE "user" = ${session?.user?.email}) + (SELECT COALESCE(SUM(amount), 0) FROM usdt WHERE "user" = ${session?.user?.email}) + (SELECT COALESCE(SUM(amount), 0) FROM xrp WHERE "user" = ${session?.user?.email}) AS total_amount;
`;

  return (
    <div className="h-full w-full items-center justify-between gap-x-5 lg:flex">
      <>
        {/* crypto */}
        <div className="bg-card h-full w-full space-y-5 rounded-xl px-3 py-5 lg:max-w-lg lg:px-5">
          {/* crypto and action */}
          <div className="flex flex-col items-center justify-center gap-y-5">
            {/* balance */}
            <div className="text-center">
              <p className="font-mono text-3xl font-semibold lg:text-4xl">
                {Number(totalAmount[0].total_amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
            {/* actions */}
            <div className="flex w-full items-center justify-between lg:px-10">
              <DepositDrawer />
              <SendDrawer />
              <SwapDrawer />
            </div>
          </div>

          {/* trending topics */}
          <div className="space-y-2 lg:hidden">
            <p className="text-xs font-semibold tracking-tight">
              Trending Topics
            </p>
            <div className="flex h-fit w-full items-center overflow-x-scroll">
              {news.map((data: any) => (
                <a href={data.link} key={data.id} target="_blank">
                  <div className="bg-muted mr-1 flex h-20 w-[18rem] items-center justify-between gap-x-3 rounded-xl p-2">
                    <div className="w-[60%] space-y-2">
                      <p className="line-clamp-2 text-sm leading-4 font-semibold opacity-90">
                        {data.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {data.source}
                      </p>
                    </div>
                    <div className="bg-muted-foreground h-[4.4rem] w-[40%] rounded-xl">
                      <img
                        src={data.imgUrl}
                        alt="image"
                        className="h-full w-full rounded-xl object-cover object-center"
                      />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* crypto */}
          <Coins />
        </div>
      </>

      {/* news */}
      <div className="bg-card hidden h-[36rem] w-full overflow-y-scroll rounded-xl p-5 lg:block">
        <p className="font-semibold tracking-tight">Trending Topics</p>
        <div className="mt-3">
          {news.map((data: any) => (
            <a href={data.link} key={data.id} target="_blank">
              <div className="bg-muted mb-3 flex h-32 w-full items-center justify-between gap-x-3 rounded-xl p-3">
                <div className="w-[60%] space-y-4">
                  <p className="line-clamp-3 leading-6 font-semibold">
                    {data.title}
                  </p>
                  <p className="text-muted-foreground text-sm">{data.source}</p>
                </div>
                <div className="bg-muted-foreground h-24 w-[40%] rounded-xl">
                  <img
                    src={data.imgUrl}
                    alt="image"
                    className="h-full w-full rounded-xl object-cover object-center"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
