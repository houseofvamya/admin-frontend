"use client";

import * as React from "react";
import { FormSection } from "@/components/admin/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function StoreSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Store settings saved",
        description: "Your changes have been saved successfully.",
        variant: "success",
      });
    }, 800);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      <FormSection title="Store details" description="Basic information about your store, shown to customers.">
        <Input label="Store name" defaultValue="House of Vamya" />
        <Input label="Contact email" type="email" defaultValue="concierge@houseofvamya.com" />
        <Textarea
          label="Store description"
          defaultValue="Fine jewellery crafted for life's most meaningful moments."
          rows={3}
        />
        <Select label="Currency" defaultValue="USD" containerClassName="max-w-xs">
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
          <option value="GBP">GBP — British Pound</option>
          <option value="INR">INR — Indian Rupee</option>
        </Select>
      </FormSection>

      <FormSection title="Store address" description="Used on invoices, receipts, and shipping labels.">
        <Input label="Address line 1" defaultValue="12 Mayfair Lane" />
        <Input label="Address line 2" placeholder="Suite, floor, etc. (optional)" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="City" defaultValue="London" />
          <Input label="Postal code" defaultValue="W1J 8AR" />
        </div>
        <Input label="Country" defaultValue="United Kingdom" />
      </FormSection>

      <div className="sticky bottom-0 z-10 flex justify-end border-t border-line bg-ivory/95 py-4 backdrop-blur">
        <Button type="submit" isLoading={isSaving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
