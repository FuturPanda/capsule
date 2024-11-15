import { Cmdk } from "@/components/commandk/Cmdk.tsx";
import { Topbar } from "@/components/layout/Topbar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { LeftSidebar } from "@/components/layout/LeftSidebar.tsx";
import { Outlet } from "@tanstack/react-router";

export const AppLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Cmdk />
      <Topbar className="shrink-0" />
      <SidebarProvider className="flex-1 flex relative">
        <LeftSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};
