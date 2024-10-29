import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from 'react'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
