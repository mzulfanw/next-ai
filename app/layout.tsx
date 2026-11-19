import type { Metadata, Viewport } from "next";
import { Shantell_Sans } from "next/font/google";
import "./globals.css";

const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  axes: ["INFM", "BNCE"],
});

export const metadata: Metadata = {
  title: "Barometer: the on-chain forecast",
  description:
    "An AI that reads blockchain activity overnight and writes you a plain-language forecast every morning. Ethereum, Solana, Base and Bitcoin.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${shantell.variable} antialiased`}>
      <body className="min-h-dvh overflow-x-clip bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
