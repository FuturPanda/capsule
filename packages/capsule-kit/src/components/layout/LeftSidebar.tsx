import * as React from "react";

import { NavUser } from "@/components/layout/nav-user.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar.tsx";
import { cn } from "@/lib/utils.ts";
import { useBoundStore } from "@/stores/global.store.ts";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Calendar,
  DatabaseZap,
  FilePen,
  SquareCheck,
  SquareTerminal,
  Users,
} from "lucide-react";

const navMain = [
  {
    title: "caplet",
    icon: <FilePen className="text-zinc-400 group-hover:text-teal-500" />,
    linkTo: "/caplets",
  },
  {
    title: "data",
    icon: <DatabaseZap className="text-zinc-400 group-hover:text-teal-500" />,
    linkTo: "/data",
  },
  {
    title: "query",
    icon: (
      <SquareTerminal className="text-zinc-400 group-hover:text-teal-500" />
    ),
    linkTo: "/query",
  },
  {
    title: "tasks",
    icon: <SquareCheck className="text-zinc-400 group-hover:text-teal-500" />,
    linkTo: "/models/tasks",
  },
  {
    title: "events",
    icon: <Calendar className="text-zinc-400 group-hover:text-teal-500" />,
    linkTo: "/models/events",
  },
  {
    title: "persons",
    icon: <Users className="text-zinc-400 group-hover:text-teal-500" />,
    linkTo: "/models/persons",
  },
];

export function LeftSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const setBreadcrumbsPath = useBoundStore((state) => state.setBreadcrumbsPath);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r border-zinc-800/50 fixed top-[var(--topbar-height)] h-[calc(100vh-var(--topbar-height))] z-10",
        className,
      )}
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {navMain.map((item) => {
                const isActive = currentPath.startsWith(item.linkTo);
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link to={item.linkTo}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                          className:
                            "bg-zinc-900 text-teal-500 border border-zinc-800",
                        }}
                        onClick={() => {
                          setBreadcrumbsPath([item.title, "DATABASES"]);
                        }}
                        isActive={isActive}
                        className={cn(
                          "px-2.5 md:px-2 group hover:bg-zinc-900/50",
                          isActive
                            ? "text-teal-500 bg-zinc-900/30"
                            : "text-zinc-400",
                        )}
                      >
                        {item.icon}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="h-18 border-t border-zinc-800/50">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
