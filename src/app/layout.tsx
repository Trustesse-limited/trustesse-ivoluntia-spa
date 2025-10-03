import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { BRAND_NAME } from "./data";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap", 
  weight: ["400", "500", "600", "700"], 
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} | Empowering Volunteers & NGOs to Create Impact`,
  description: `${BRAND_NAME} is a platform that connects passionate volunteers with impactful NGOs. Discover opportunities, manage campaigns, and build a community driven by purpose and change.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="antialiased font-sans">
        <div className="max-w-[1538px] font-openSans min-h-screen flex flex-col justify-start items-center relative  px-2  w-[100%]">
          {children}
        </div>
      </body>
    </html>
  );
}

