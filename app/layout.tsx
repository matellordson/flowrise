import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "./client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flowrise Co.",
  description:
    "We’re a next-gen financial platform combining crypto wallets, asset investing, banking, and trading — all in one secure, user-friendly place. Empowering you to manage, grow, and access your money effortlessly.",
};

export const revalidate = 86400;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>

        <Script
          id="smartsupp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '9079140ea07a665fa32a668149b6bfbe1e025515';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `,
          }}
        />

        <noscript>
          Powered by{" "}
          <a href="https://www.smartsupp.com" target="_blank" rel="noreferrer">
            Smartsupp
          </a>
        </noscript>
      </body>
    </html>
  );
}
