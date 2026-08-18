import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Nav } from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fantasy Liga Chilena",
  description:
    "Fantasy de fútbol chileno con notas puestas a mano por tus streamers favoritos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SessionProviderWrapper>
          <Nav />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-xs text-muted">
            Fantasy Liga Chilena — proyecto de fans, no afiliado a la ANFP.
          </footer>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
