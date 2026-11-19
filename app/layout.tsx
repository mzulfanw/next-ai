import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Barometer: the on-chain forecast",
  description:
    "An AI that reads blockchain activity overnight and writes you a plain-language forecast every morning. Ethereum, Solana, Base and Bitcoin.",
};

export const viewport: Viewport = {
  themeColor: "#070c1f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mona.variable} antialiased`}>
      <body className="min-h-dvh bg-night font-sans text-fg">{children}</body>
    </html>
  );
}
