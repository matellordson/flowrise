import Link from "next/link";

export default function Coins() {
  return (
    <div className="">
      <p className="font-semibold tracking-tight hidden lg:block">Crypto</p>
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border "></div>
            <div className="">
              <p className="font-semibold tracking-tight">Bitcoin</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>
      <Link href={"#"}>
        <div className="flex justify-between items-center hover:bg-muted rounded px-1 py-2">
          {/* left */}
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 w-10 bg-muted rounded-full border "></div>
            <div className="">
              <p className="font-semibold tracking-tight">Bitcoin</p>
              <p className="text-sm">$107,198.58</p>
            </div>
          </div>

          {/* right */}
          <div className="text-end">
            <p className="font-semibold tracking-tight font-mono">0</p>
            <p className="text-sm">$0.00</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
