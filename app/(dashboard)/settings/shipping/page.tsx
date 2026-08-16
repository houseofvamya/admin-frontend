"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { FormSection } from "@/components/admin/FormSection";
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";
import { formatPrice } from "@/lib/utils";
import { Truck } from "lucide-react";

interface ShippingZone {
  id: string;
  name: string;
  rate: number;
  estimate: string;
}

const INITIAL_ZONES: ShippingZone[] = [
  { id: "zone-domestic", name: "Domestic (UK)", rate: 12, estimate: "2-4 business days" },
  { id: "zone-eu", name: "European Union", rate: 28, estimate: "4-7 business days" },
  { id: "zone-row", name: "Rest of World", rate: 45, estimate: "7-14 business days" },
];

export default function ShippingSettingsPage() {
  const { toast } = useToast();
  const [zones, setZones] = React.useState<ShippingZone[]>(INITIAL_ZONES);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newZone, setNewZone] = React.useState({ name: "", rate: "", estimate: "" });

  const [freeShippingEnabled, setFreeShippingEnabled] = React.useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = React.useState("2500");
  const [isSavingThreshold, setIsSavingThreshold] = React.useState(false);

  function handleAddZone(event: React.FormEvent) {
    event.preventDefault();
    const rate = Number.parseFloat(newZone.rate);
    if (!newZone.name.trim() || !newZone.estimate.trim() || !Number.isFinite(rate)) return;

    setZones((prev) => [
      ...prev,
      { id: `zone-${Date.now()}`, name: newZone.name.trim(), rate, estimate: newZone.estimate.trim() },
    ]);
    setNewZone({ name: "", rate: "", estimate: "" });
    setIsModalOpen(false);
    toast({ title: "Shipping rate added", variant: "success" });
  }

  function handleSaveThreshold() {
    setIsSavingThreshold(true);
    window.setTimeout(() => {
      setIsSavingThreshold(false);
      toast({ title: "Shipping preferences saved", variant: "success" });
    }, 800);
  }

  return (
    <div className="flex flex-col gap-8">
      <FormSection
        title="Shipping zones"
        description="Set delivery rates and estimates for different regions."
      >
        <div className="flex flex-col gap-3">
          {zones.map((zone) => (
            <Card key={zone.id} variant="flat" className="border-line">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream text-charcoal-soft">
                    <Truck className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{zone.name}</p>
                    <p className="text-sm text-charcoal-soft">{zone.estimate}</p>
                  </div>
                </div>
                <p className="font-display text-lg text-charcoal">{formatPrice(zone.rate)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            Add Rate
          </Button>
        </div>
      </FormSection>

      <FormSection
        title="Free shipping"
        description="Offer free shipping automatically once a customer's cart crosses a spend threshold."
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-charcoal">Enable free shipping threshold</p>
            <p className="text-sm text-charcoal-soft">Applies to all shipping zones at checkout.</p>
          </div>
          <ToggleSwitch
            checked={freeShippingEnabled}
            onCheckedChange={setFreeShippingEnabled}
            label="Enable free shipping threshold"
          />
        </div>
        {freeShippingEnabled && (
          <Input
            label="Minimum order amount"
            type="number"
            min={0}
            value={freeShippingThreshold}
            onChange={(event) => setFreeShippingThreshold(event.target.value)}
            containerClassName="max-w-xs"
          />
        )}
        <div className="flex justify-end pt-2">
          <Button type="button" isLoading={isSavingThreshold} onClick={handleSaveThreshold}>
            Save changes
          </Button>
        </div>
      </FormSection>

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Add shipping rate</ModalTitle>
            <ModalDescription>Create a new shipping zone and rate.</ModalDescription>
          </ModalHeader>
          <form onSubmit={handleAddZone} className="flex flex-col gap-4">
            <Input
              label="Zone name"
              placeholder="e.g. North America"
              value={newZone.name}
              onChange={(event) => setNewZone((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              label="Rate"
              type="number"
              min={0}
              placeholder="e.g. 20"
              value={newZone.rate}
              onChange={(event) => setNewZone((prev) => ({ ...prev, rate: event.target.value }))}
              required
            />
            <Input
              label="Delivery estimate"
              placeholder="e.g. 5-8 business days"
              value={newZone.estimate}
              onChange={(event) => setNewZone((prev) => ({ ...prev, estimate: event.target.value }))}
              required
            />
            <ModalFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add rate</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
