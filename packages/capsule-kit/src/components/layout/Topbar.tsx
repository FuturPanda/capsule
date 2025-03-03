import { ComboboxDatabase } from "@/components/ComboBoxDatabase.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { cn } from "@/lib/utils.ts";
import { useBoundStore } from "@/stores/global.store.ts";
import { Link } from "@tanstack/react-router";
import { Slash } from "lucide-react";
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
        "h-[var(--topbar-height)] flex items-center justify-between px-4",
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
        <div className="w-8"></div>
        <Breadcrumb>
          <BreadcrumbList>
            {path.map((pathName, index) => {
              return pathName !== "DATABASES" ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={pathName}>{pathName}</BreadcrumbLink>
                  </BreadcrumbItem>
                  {index === path.length - 1 ? (
                    <></>
                  ) : (
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                  )}
                </>
              ) : (
                <ComboboxDatabase
                  databases={databases}
                  setSelectedDb={setSelectedDatabaseId}
                  selectedDb={selectedDatabase}
                />
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
