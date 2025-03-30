import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar.tsx";
import { useBoundStore } from "@/stores/global.store.ts";
import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

export function NavUser() {
  const user = useBoundStore((state) => state.user);
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  return user ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex h-14 items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-zinc-900/50"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-zinc-800">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback className="rounded-lg bg-zinc-900 text-teal-500">
                    "AV"{/* {user.username.substring(0, 2).toUpperCase()} */}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-zinc-800 bg-background"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg border border-zinc-800">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="rounded-lg bg-zinc-900 text-teal-500">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-zinc-100">
                      {user.username}
                    </span>
                    <span className="truncate text-xs text-zinc-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-800 hover:text-teal-500">
                  <Sparkles className="h-4 w-4 mr-2 text-teal-500" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onMouseDown={() => navigate({ to: "/account" })}
                  className="text-zinc-300 hover:bg-zinc-800 hover:text-teal-500"
                >
                  <BadgeCheck className="h-4 w-4 mr-2 text-teal-500" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-800 hover:text-teal-500">
                  <CreditCard className="h-4 w-4 mr-2 text-teal-500" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-800 hover:text-teal-500">
                  <Bell className="h-4 w-4 mr-2 text-teal-500" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-zinc-300 hover:bg-zinc-800 hover:text-red-500">
                <LogOut className="h-4 w-4 mr-2 text-red-500" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <></>
  );
}
