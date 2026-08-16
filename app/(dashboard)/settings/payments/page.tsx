"use client";

import * as React from "react";
import { FormSection } from "@/components/admin/FormSection";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";

interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cards",
    label: "Credit & Debit Cards",
    description: "Accept Visa, Mastercard, and American Express through your payment gateway.",
    defaultEnabled: true,
  },
  {
    id: "upi",
    label: "UPI",
    description: "Accept instant bank transfers through UPI-enabled apps.",
    defaultEnabled: true,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Allow customers to pay in cash when their order is delivered.",
    defaultEnabled: false,
  },
];

export default function PaymentsSettingsPage() {
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(PAYMENT_METHODS.map((method) => [method.id, method.defaultEnabled])),
  );
  const [isSaving, setIsSaving] = React.useState(false);

  function handleSave() {
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Payment settings saved", variant: "success" });
    }, 800);
  }

  return (
    <FormSection title="Payment methods" description="Choose which payment methods are available at checkout.">
      <div className="flex flex-col divide-y divide-line">
        {PAYMENT_METHODS.map((method) => (
          <div key={method.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-charcoal">{method.label}</p>
              <p className="text-sm text-charcoal-soft">{method.description}</p>
            </div>
            <ToggleSwitch
              checked={enabled[method.id] ?? false}
              onCheckedChange={(checked) => setEnabled((prev) => ({ ...prev, [method.id]: checked }))}
              label={method.label}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="button" isLoading={isSaving} onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </FormSection>
  );
}
