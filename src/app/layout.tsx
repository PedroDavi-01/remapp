import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import  Navbar  from "@/src/components/navbar" 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Remapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-br" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="bg-slate-50 min-h-screen">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}