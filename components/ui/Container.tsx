import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

function Container({ className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

function NarrowContainer({ className, ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-narrow px-4 sm:px-6", className)} {...props} />;
}

export { Container, NarrowContainer };
