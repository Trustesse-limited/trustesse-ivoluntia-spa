import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap", 
  weight: ["400", "500", "600", "700"], 
});

export const metadata: Metadata = {
  title: "Ivoluntia | Empowering Volunteers & NGOs to Create Impact",
  description:
    "Ivoluntia is a platform that connects passionate volunteers with impactful NGOs. Discover opportunities, manage campaigns, and build a community driven by purpose and change.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}

