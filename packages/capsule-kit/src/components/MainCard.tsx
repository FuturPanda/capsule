import { Card } from "@/components/ui/card.tsx";
import * as React from "react";
import { cn } from "@/lib/utils.ts";

export const MainCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "w-[calc(100%-10px)] h-[calc(var(--sidebar-height)_-_10px)] p-10",
      className,
    )}
    {...props}
  />
));
