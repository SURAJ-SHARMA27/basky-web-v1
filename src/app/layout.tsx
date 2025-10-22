import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basky AI | Grocery Price Comparison",
  description: "Basky helps you compare prices and availability of groceries across Zepto, Blinkit, and Swiggy Instamart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
