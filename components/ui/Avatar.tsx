"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold-soft/50 font-medium text-gold-deep",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-14 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  name: string;
  className?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

function Avatar({ src, name, size, className }: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span className={cn(avatarVariants({ size }), className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? undefined}
          alt={name}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden>{getInitials(name)}</span>
      )}
    </span>
  );
}

export { Avatar, avatarVariants };
