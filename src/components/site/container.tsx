import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

// Centers content with consistent horizontal padding across the site.
export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
