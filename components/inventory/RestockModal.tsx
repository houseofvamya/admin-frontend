"use client";

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export interface RestockTarget {
  variantId: string;
  productName: string;
  sku: string;
  currentStock: number;
}

export interface RestockModalProps {
  target: RestockTarget | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (variantId: string, quantity: number, note: string) => void;
}

function RestockModal({ target, onOpenChange, onSubmit }: RestockModalProps) {
  const [quantity, setQuantity] = React.useState("10");
  const [note, setNote] = React.useState("");
  const [lastVariantId, setLastVariantId] = React.useState<string | null>(null);

  if (target && target.variantId !== lastVariantId) {
    setLastVariantId(target.variantId);
    setQuantity("10");
    setNote("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!target) return;
    const parsedQuantity = Number.parseInt(quantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) return;
    onSubmit(target.variantId, parsedQuantity, note.trim());
    onOpenChange(false);
  }

  return (
    <Modal open={Boolean(target)} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Restock item</ModalTitle>
          <ModalDescription>
            {target ? (
              <>
                {target.productName} &middot; SKU {target.sku} &middot; Current stock {target.currentStock}
              </>
            ) : null}
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Quantity to add"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
          <Textarea
            label="Note (optional)"
            placeholder="e.g. Received from supplier shipment #1042"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
          />
          <ModalFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm restock</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { RestockModal };
