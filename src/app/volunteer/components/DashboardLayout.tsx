"use client";

import Link from "next/link";
import { FiBell, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { BRAND_NAME } from "@/app/data";

type NavLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type DashboardLayoutProps = {
  navLinks: NavLink[];
  children?: React.ReactNode;
  headerTitle: string;
};

export default function DashboardLayout({
  navLinks,
  children,
  headerTitle,
}: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-[#A9A7A7] shadow-md fixed top-0 left-0 bottom-0 z-20">
        <div className="h-20 flex items-center justify-start pl-8 border-b-2 border-[#A9A7A7]">
          <h1 className="text-xl font-bold text-black">{BRAND_NAME}</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul>
            {navLinks.map((link) => {
              const isActive = link.href === "/volunteer" 
                ? pathname === link.href 
                : pathname.startsWith(link.href);
              return (
                <li key={link.href} className="mb-2">
                  <Link
                    href={link.href}
                    className={`rounded-[8px] w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold ${
                      isActive
                        ? "bg-[#0E68DC] text-[#FFFFFF]"
                        : "text-black bg-transparent"
                    } hover:bg-[#0E68DC] hover:text-[#FFFFFF]`}
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Link */}
        <footer className="px-4 pb-6 md:pb-8 mt-auto">
          <Link
            href="/login"
            className="rounded-[8px] w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold text-black hover:opacity-90 hover:bg-[#0000011c] transition-class"
          >
            <FiLogOut className="mr-2 text-lg" />
            Sign Out
          </Link>
        </footer>
      </aside>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm backdrop-brightness-75 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-4 flex flex-col justify-between md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-lg font-bold truncate">
                    {BRAND_NAME}
                  </h2>
                  <button
                    title="Close Menu"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <FiX className="text-xl text-gray-600 cursor-pointer" />
                  </button>
                </div>
                <nav>
                  <ul>
                    {navLinks.map((link) => {
                      const isActive = link.href === "/volunteer" 
                        ? pathname === link.href 
                        : pathname.startsWith(link.href);
                      return (
                        <li key={link.href} className="mb-2">
                          <Link
                            href={link.href}
                            className={`rounded-[8px] w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold ${
                              isActive
                                ? "bg-[var(--buttonPrimary)] text-[#FFFFFF]"
                                : "text-black bg-transparent"
                            } hover:bg-[var(--buttonPrimary)] hover:text-[#FFFFFF]`}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            {link.icon && (
                              <span className="mr-2">{link.icon}</span>
                            )}
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {/* Logout Link */}
              <div className="my-6">
                <Link
                  href="/login"
                  className="rounded-[8px] w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold text-black hover:opacity-90 hover:bg-[#0000011c] transition-class"
                >
                  <FiLogOut className="mr-2 text-lg" />
                  Sign Out
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Section */}
      <div className="flex flex-col flex-1 md:ml-52 h-full">
        <header className="sticky top-0 z-30 bg-white h-20 flex items-center justify-between gap-4 px-4 md:px-6 border-b sm:border-b-2 border-[#A9A7A7]">
          <h1 className="text-lg md:hidden font-bold text-black w-fit">
            {BRAND_NAME}
          </h1>
          <h2 className="hidden md:block text-xl font-bold text-[#000000]">
            {headerTitle}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-[var(--buttonPrimary)] text-white text-sm font-semibold px-6 py-2 rounded-[8px] transition-class cursor-pointer hover:opacity-90">
              Donate
            </button>
            <div className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#ECF6FE]">
              <FiBell className="text-gray-600 text-xl cursor-pointer" />
            </div>
            <div className="flex items-center px-2 py-1 rounded-[8px] bg-[#ECF6FE] space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src="/images/Ellipse 1.png"
                  alt="Volunteer Avatar"
                  width={32}
                  height={32}
                />
              </div>
              <span className="hidden sm:inline text-sm font-semibold bg-gradient-to-r from-[#9161FD] to-[#06A3DA] bg-clip-text text-transparent">
                Volunteer
              </span>
            </div>
            <button
              title="Open Menu"
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden cursor-pointer"
            >
              <FiMenu className="text-2xl text-gray-700" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-full w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
