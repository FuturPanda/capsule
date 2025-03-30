import { cn } from "@/lib/utils.ts";
import { useBoundStore } from "@/stores/global.store.ts";
import { Link } from "@tanstack/react-router";
import { ComponentProps } from "react";

type TopbarComponentProps = ComponentProps<"header">;

export function Topbar({ className, ...props }: TopbarComponentProps) {
  const path = useBoundStore((state) => state.breadcrumbsPath);
  const databases = useBoundStore((state) => state.databases);
  const selectedDatabase = useBoundStore((state) => state.selectedDatabase);
  const setSelectedDatabaseId = useBoundStore(
    (state) => state.setSelectedDatabaseId,
  );
  return (
    <header
      className={cn(
        "h-[var(--topbar-height)] flex items-center justify-between px-4 bg-black/70 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="custom-text text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
        >
          <div>capsule</div>
        </Link>
        <div className="w-8"></div>
      </div>
    </header>
  );
}
