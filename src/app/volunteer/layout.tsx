import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import { navLinks } from "./components/navlinks";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navLinks={navLinks} headerTitle="">
      {children}
    </DashboardLayout>
  );
}
