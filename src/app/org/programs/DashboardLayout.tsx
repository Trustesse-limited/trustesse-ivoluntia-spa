"use client";
import Link from "next/link";
import { FiBell } from "react-icons/fi";
import Image from "next/image";
import { BRAND_NAME } from "@/app/data";

type NavLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type DashboardLayoutProps = {
  navLinks: NavLink[];
  children: React.ReactNode;
};

export default function DashboardLayout({
  navLinks,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="flex items-center justify-between bg-white px-6 py-4 border-b-[2px] border-[#A9A7A7]">
        <h1 className="text-xl font-bold text-[#000000]">{BRAND_NAME}</h1>
        <div className="flex items-center space-x-4">
          <button className="bg-[#0E68DC] text-white px-4 py-2 rounded hover:bg-blue-700">
            Donate
          </button>
          <FiBell className="text-gray-600 text-xl cursor-pointer" />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
            <Image
              src="/images/Ellipse 1.png"
              alt="Admin Avatar"
              width={32}
              height={32}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-58 bg-white shadow-md p-4  border-[#A9A7A7] border-r-[2px]">
          <nav>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href} className="mb-5">
                  <Link
                    href={link.href}
                    className="flex items-center text-[#000000] font-semibold text-sm hover:text-[#0E68DC]"
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1  border-[#A9A7A7]">
          {children}
        </main>
      </div>
    </div>
  );
}
