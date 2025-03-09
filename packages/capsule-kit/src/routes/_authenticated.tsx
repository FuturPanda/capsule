import { Cmdk } from "@/components/commandk/Cmdk.tsx";
import { LeftSidebar } from "@/components/layout/LeftSidebar.tsx";
import { Topbar } from "@/components/layout/Topbar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const AppLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Cmdk />
      <Topbar className="shrink-0 border-b border-zinc-800 h-[var(--topbar-height)] z-10" />

      <SidebarProvider className="flex-1 flex overflow-hidden relative">
        <LeftSidebar className="fixed left-0 top-[var(--topbar-height)] h-[calc(100vh-var(--topbar-height))]" />

        <div className="flex-1 ml-[var(--sidebar-width-icon)] overflow-hidden">
          <div className="h-[calc(100vh-var(--topbar-height))] overflow-y-auto overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    const tokens = JSON.parse(
      sessionStorage.getItem("capsule_auth_tokens") || "{}",
    );
    if (!tokens.accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AppLayout,
});
