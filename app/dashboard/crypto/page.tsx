import Coins from "./coins";
import { DepositDrawer } from "./deposit";
import { SwapDrawer } from "./swap";
import { SendDrawer } from "./send";
import { sql } from "@/lib/sql";
import { auth } from "@/auth";
import getCryptoNews from "./(news)/api";
import Link from "next/link";
import Image from "next/image";

interface newsTypes {
  id: string;
  title: string;
  imgUrl: string;
  source: string;
  link: string;
}

export default async function CryptoDashboard() {
  const news: newsTypes[] = await getCryptoNews();
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
            <div className="bg-muted h-20 w-full rounded-xl"></div>
          </div>

          {/* crypto */}
          <Coins />
        </div>
      </>

      {/* news */}
      <div className="bg-card hidden h-full w-full rounded-xl p-5 lg:block">
        {/* <pre>{JSON.stringify(news, null, 2)}</pre> */}
        <p className="text-sm font-semibold tracking-tight">Trending Topics</p>
        <div className="mt-3">
          {news.map((data) => (
            <Link href={data.link} key={data.id}>
              <div className="bg-muted flex h-24 w-full items-center justify-between gap-x-3 rounded-xl px-3">
                <div className="w-[60%]">
                  <p className="line-clamp-4 leading-6 font-semibold">
                    {data.title}
                  </p>
                  <p className="text-muted-foreground text-sm">{data.source}</p>
                </div>
                <div className="h-20 w-[40%] rounded-xl bg-red-500">
                  <Image
                    src={data.imgUrl}
                    alt={data.title}
                    height={200}
                    width={400}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
