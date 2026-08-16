"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const TOAST_DURATION = 4000;

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const toastVariantStyles: Record<ToastVariant, string> = {
  default: "border-line bg-ivory text-charcoal",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

const toastIcons: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="size-5 shrink-0 text-gold-deep" />,
  success: <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />,
  error: <XCircle className="size-5 shrink-0 text-red-600" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...item, id }]);
    return id;
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={TOAST_DURATION} swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            onOpenChange={(open) => {
              if (!open) dismiss(item.id);
            }}
            className={cn(
              "pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border p-4 shadow-elevated transition-all data-[state=open]:animate-none data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=closed]:opacity-0",
              toastVariantStyles[item.variant ?? "default"],
            )}
          >
            {toastIcons[item.variant ?? "default"]}
            <div className="flex-1">
              <ToastPrimitive.Title className="text-sm font-semibold">
                {item.title}
              </ToastPrimitive.Title>
              {item.description && (
                <ToastPrimitive.Description className="mt-0.5 text-sm opacity-80">
                  {item.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="rounded-full p-1 opacity-60 transition-opacity hover:opacity-100">
              <X className="size-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-6 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
