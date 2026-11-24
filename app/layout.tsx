import "./globals.css";
import type { Metadata } from "next";
import { StoreProvider } from "@/components/Store";
import Nav from "@/components/Nav";

export const metadata: Metadata = { title: "Filter Wala", description: "Water jar & filter delivery" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <StoreProvider>
          <Nav />
          <main className="mx-auto max-w-3xl p-4">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}