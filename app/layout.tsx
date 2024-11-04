import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from 'next/font/google';
import "./globals.css";
import React from 'react';
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider';
import { Toaster } from "@/components/ui/toaster";

const font = M_PLUS_Rounded_1c({ weight:"700", subsets: ['latin'] });

export const metadata: Metadata = {
  title: "EFSA-KU | Join the Waitlist for Economic Frontiers Students Association - Kenyatta University",
  description: "Join the waitlist for EFSA-KU - Empowering Kenyatta University students in economics with skills, knowledge, and global insights",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ReactQueryClientProvider>
        <html lang="en">
        <body
            className={`${font.className} bg-gray-100`}
        >
        <main>{children}</main>
        <Toaster />
        </body>
        </html>
      </ReactQueryClientProvider>
  );
}