import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ECOLAR - Construção & Decoração | Materiais de Qualidade",
  description: "Telhas, tijolos, pisos e elementos decorativos com qualidade e tradição. Orçamento rápido e entrega por carrada.",
  keywords: "telhas, tijolos, pisos, construção, decoração, materiais de construção",
  authors: [{ name: "ECOLAR" }],
  openGraph: {
    title: "ECOLAR - Construção & Decoração",
    description: "Materiais de construção e decoração com qualidade e tradição",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script src="/lasy-bridge.js" strategy="beforeInteractive" />
      </head>
      <body
        className={`${inter.variable} ${dmSans.variable} font-inter antialiased bg-[#f5f6f7]`}
      >
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}