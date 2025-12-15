import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackWidget from "@/components/FeedbackWidget";
import { getNavSettings } from "@/actions/settings"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RTEÜ HAYAT - Hayalleri Yaşatma Topluluğu",
  description: "Recep Tayyip Erdoğan Üniversitesi Hayalleri Yaşatma Topluluğu Resmi Web Sitesi",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = await getNavSettings()

  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar links={navLinks} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <FeedbackWidget />
        </Providers>
      </body>
    </html>
  );
}
