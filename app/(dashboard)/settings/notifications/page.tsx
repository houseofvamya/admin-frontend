"use client";

import * as React from "react";
import { FormSection } from "@/components/admin/FormSection";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "new-order",
    label: "New order emails",
    description: "Get notified by email whenever a customer places a new order.",
    defaultEnabled: true,
  },
  {
    id: "low-stock",
    label: "Low stock alert emails",
    description: "Get notified when a product variant falls at or below its low stock threshold.",
    defaultEnabled: true,
  },
  {
    id: "new-customer",
    label: "New customer emails",
    description: "Get notified whenever a new customer creates an account.",
    defaultEnabled: false,
  },
];

export default function NotificationsSettingsPage() {
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_SETTINGS.map((setting) => [setting.id, setting.defaultEnabled])),
  );
  const [isSaving, setIsSaving] = React.useState(false);

  function handleSave() {
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Notification preferences saved", variant: "success" });
    }, 800);
  }

  return (
    <FormSection
      title="Email notifications"
      description="Choose which events send an email notification to your admin team."
    >
      <div className="flex flex-col divide-y divide-line">
        {NOTIFICATION_SETTINGS.map((setting) => (
          <div key={setting.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-charcoal">{setting.label}</p>
              <p className="text-sm text-charcoal-soft">{setting.description}</p>
            </div>
            <ToggleSwitch
              checked={enabled[setting.id] ?? false}
              onCheckedChange={(checked) => setEnabled((prev) => ({ ...prev, [setting.id]: checked }))}
              label={setting.label}
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
