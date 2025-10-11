import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "./_components/Header";
import Navbar from "./_components/Navbar";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${LINESeedSansTH.className} antialiased`}
      >
        <Header/>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
