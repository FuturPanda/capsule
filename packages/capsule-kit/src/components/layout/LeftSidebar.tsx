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
import { DatabaseZap, Pill } from "lucide-react";
import { Link } from "@tanstack/react-router";

const navMain = [
  {
    title: "data",
    icon: <DatabaseZap />,
    linkTo: "/data",
  },
  {
    title: "caplets",
    icon: <Pill />,
    linkTo: "/caplets",
  },
];

export function LeftSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "!w-[calc(var(--sidebar-width-icon)_+_1px)] h-[var(--sidebar-height)] border-r ",
        className,
      )}
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link to={item.linkTo}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {}}
                      isActive={true}
                      className="px-2.5 md:px-2"
                    >
                      {item.icon}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="h-18 border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}