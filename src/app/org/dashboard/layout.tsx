import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrgSidebar } from "./components/org-sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <OrgSidebar />
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
            {/* Search Bar */}
            <div className="w-full max-w-md">
              <Input placeholder="Search resources, roles..." />
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/avatars/org-admin.jpg" alt="Org Admin" />
                <AvatarFallback>OA</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Emmanuel</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
