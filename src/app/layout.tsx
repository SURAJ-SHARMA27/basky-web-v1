import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basky AI | Grocery Price Comparison",
  description: "Basky helps you compare prices and availability of groceries across Zepto, Blinkit, and Swiggy Instamart.",
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
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
