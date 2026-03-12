import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegister from "./components/PWARegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#7c3aed",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Manga Scroller - Auto-scroll any website",
  description:
    "Read manga and novels with customizable auto-scrolling. Install as an app on your phone for the best reading experience.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Manga Scroller",
  },
  icons: {
    icon: "/logoZ.png",
    apple: "/logoZ.png",
  },
  openGraph: {
    title: "Manga Scroller",
    description: "Auto-scroll any manga or novel website at your own pace",
    type: "website",
  },
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
        <PWARegister />
      </body>
    </html>
  );
}
