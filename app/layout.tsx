import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Logo from "@/components/Logo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Team Calendar",
  description: "Book time with people and teams at Sisu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "var(--brand-surface)" }}>
        <header
          className="border-b px-8 py-4"
          style={{ borderColor: "var(--brand-border)", background: "var(--background)" }}
        >
          <a href="/">
            <Logo />
          </a>
        </header>
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
