import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import { StoreProvider } from "@/components/Store";
import { LangProvider } from "@/components/Lang";
import Nav from "@/components/Nav";

const font = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = { title: "Filter Wala", description: "Water jar & filter delivery" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen ${font.className}`}>
        <LangProvider>
          <StoreProvider>
            <Nav />
            <main className="mx-auto max-w-3xl p-4">{children}</main>
          </StoreProvider>
        </LangProvider>
      </body>
    </html>
  );
}