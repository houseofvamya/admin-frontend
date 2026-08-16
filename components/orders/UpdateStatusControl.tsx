"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import type { OrderStatus } from "@/lib/types/order";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export interface UpdateStatusControlProps {
  orderNumber: string;
  currentStatus: OrderStatus;
}

function UpdateStatusControl({ orderNumber, currentStatus }: UpdateStatusControlProps) {
  const { toast } = useToast();
  const [status, setStatus] = React.useState<OrderStatus>(currentStatus);
  const [isSaving, setIsSaving] = React.useState(false);

  function handleUpdate() {
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Order status updated",
        description: `${orderNumber} is now marked as ${status}.`,
        variant: "success",
      });
    }, 500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal-soft">Current status</span>
        <StatusBadge status={status} domain="order" />
      </div>
      <Select aria-label="Update status" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </Select>
      <Button
        variant="secondary"
        onClick={handleUpdate}
        isLoading={isSaving}
        disabled={status === currentStatus && !isSaving}
      >
        Update Status
      </Button>
    </div>
  );
}

export { UpdateStatusControl };
