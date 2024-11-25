import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils.ts";
import { ComponentProps } from "react";

type TopbarComponentProps = ComponentProps<"header"> & { isOnline: boolean };

export function Topbar({
  className,
  isOnline,
  ...props
}: TopbarComponentProps) {
  const isProcessing = true;
  const queue = { length: 15 };

  return (
    <header
      className={cn(
        "h-[var(--topbar-height)] border-b border-zinc-800 flex items-center justify-between px-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
        >
          <div>CAPSULE</div>
        </Link>
      </div>
      <div className="flex items-center justify-end gap-2 text-sm text-zinc-400">
        <div className="text-xs text-zinc-500 opacity-0 hover:opacity-100 transition-opacity">
          {isProcessing ? "Syncing..." : `${queue.length} pending`}
        </div>
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            isProcessing ? "bg-blue-500 animate-pulse" : "bg-green-500",
          )}
        />
        <div className="text-xs text-zinc-500 ">
          {isOnline ? "Online" : "Offline"}
        </div>
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            !isOnline ? "bg-orange-400  animate-pulse" : "bg-green-500",
          )}
        />
      </div>
    </header>
  );
}
