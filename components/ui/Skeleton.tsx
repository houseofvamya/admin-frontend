import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-gradient-to-r from-cream via-ivory to-cream bg-[length:200%_100%] animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
