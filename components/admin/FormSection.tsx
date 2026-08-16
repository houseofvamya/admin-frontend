import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn("flex flex-col gap-4 md:flex-row md:gap-10", className)}>
      <div className="flex flex-col gap-1.5 md:w-64 md:shrink-0">
        <h3 className="font-display text-lg text-charcoal">{title}</h3>
        {description && <p className="text-sm text-charcoal-soft">{description}</p>}
      </div>
      <Card variant="flat" className="flex-1 p-6">
        <div className="flex flex-col gap-5">{children}</div>
      </Card>
    </section>
  );
}

export { FormSection };
