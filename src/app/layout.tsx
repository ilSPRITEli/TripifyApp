import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import Navbar from "./_components/Navbar";
import RegisterSW from "./_components/RegisterSW";
import "./globals.css";

const LINESeedSansTH = localFont({
  src: [
    { path: "../../public/fonts/LINESeedSansTH_W_Rg.woff2", weight: "400", style: "thin" },
    { path: "../../public/fonts/LINESeedSansTH_W_Rg.woff2", weight: "500", style: "regular" },
    { path: "../../public/fonts/LINESeedSansTH_W_Bd.woff2", weight: "600", style: "bold" },
    { path: "../../public/fonts/LINESeedSansTH_W_Bd.woff2", weight: "700", style: "extrabold" },
    { path: "../../public/fonts/LINESeedSansTH_W_Bd.woff2", weight: "800", style: "heavy" }
  ],
  variable: "--font-lineseedsansth",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tripify",
  description: "Creatre and share your travel itineraries with ease.",
  applicationName: "Tripify",
  // themeColor has been moved to the viewport export according to Next.js requirements.
  manifest: "./manifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ชื่อสั้นๆ" />
        <link rel="apple-touch-icon" href="/public/icon.svg" />
      </head>
      <body
        className={`${LINESeedSansTH.className} antialiased bg-background overflow-x-hidden no-scrollbar`}
      >
        <Toaster position="top-center" />
        <RegisterSW />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
