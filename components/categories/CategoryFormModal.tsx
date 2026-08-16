"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils";
import type { Category } from "@/lib/types/category";

export interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Category being edited, or null when creating a new one. */
  category: Category | null;
  /** Top-level categories eligible to be selected as a parent. */
  parentOptions: Category[];
}

interface CategoryFormState {
  name: string;
  slug: string;
  parentId: string;
  description: string;
  status: Category["status"];
}

const EMPTY_FORM: CategoryFormState = {
  name: "",
  slug: "",
  parentId: "",
  description: "",
  status: "active",
};

function CategoryFormModal({ open, onOpenChange, category, parentOptions }: CategoryFormModalProps) {
  const { toast } = useToast();
  const [form, setForm] = React.useState<CategoryFormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = React.useState(false);

  // Re-seed the form whenever the modal transitions to an open state, so
  // editing a different category (or switching to create mode) starts fresh.
  // This runs during render rather than in an effect, per the React docs'
  // "adjusting state when a prop changes" pattern.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (category) {
        setForm({
          name: category.name,
          slug: category.slug,
          parentId: category.parentId ?? "",
          description: category.description,
          status: category.status,
        });
        setSlugTouched(true);
      } else {
        setForm(EMPTY_FORM);
        setSlugTouched(false);
      }
    }
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: slugify(value) }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    toast({
      title: category ? "Category updated" : "Category created",
      description: `"${form.name}" has been ${category ? "saved" : "added to your catalogue"}.`,
      variant: "success",
    });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>{category ? "Edit Category" : "Add Category"}</ModalTitle>
          <ModalDescription>
            {category
              ? "Update the details for this category."
              : "Create a new category for customers to browse."}
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="e.g. Cocktail Rings"
            required
          />

          <Input
            label="Slug"
            value={form.slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            helperText="Used in the storefront URL. Generated automatically from the name."
            required
          />

          <Select
            label="Parent Category"
            value={form.parentId}
            onChange={(event) => setForm((prev) => ({ ...prev, parentId: event.target.value }))}
          >
            <option value="">None (top-level category)</option>
            {parentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>

          <Textarea
            label="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            placeholder="A short description shown on the storefront."
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as Category["status"] }))
            }
          >
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </Select>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              {category ? "Save Changes" : "Create Category"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export { CategoryFormModal };
