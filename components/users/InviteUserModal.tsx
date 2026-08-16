"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import type { AdminUser } from "@/lib/types/admin-user";

export interface InviteUserFormData {
  name: string;
  email: string;
  role: AdminUser["role"];
}

export interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: InviteUserFormData) => void;
}

const EMPTY_FORM: InviteUserFormData = { name: "", email: "", role: "support" };

function InviteUserModal({ open, onOpenChange, onInvite }: InviteUserModalProps) {
  const [form, setForm] = React.useState<InviteUserFormData>(EMPTY_FORM);

  // Reset the form whenever the modal transitions to an open state. Done
  // during render (the "adjusting state when a prop changes" pattern) rather
  // than in an effect, so it doesn't trigger an extra render pass.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setForm(EMPTY_FORM);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onInvite(form);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Invite User</ModalTitle>
          <ModalDescription>Send an invitation to join the House of Vamya admin team.</ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="e.g. Margot Fontaine"
            required
          />
          <Input
            label="Email address"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="name@houseofvamya.com"
            required
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as AdminUser["role"] }))}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="support">Support</option>
          </Select>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              Send Invitation
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { InviteUserModal };
