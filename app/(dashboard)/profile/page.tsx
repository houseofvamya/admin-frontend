"use client";

import * as React from "react";
import { Camera, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormSection } from "@/components/admin/FormSection";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ADMIN_USERS } from "@/lib/mock-data/users";

const CURRENT_USER = ADMIN_USERS[0]!;

export default function ProfilePage() {
  const { toast } = useToast();

  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [passwords, setPasswords] = React.useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    setIsSavingProfile(true);
    window.setTimeout(() => {
      setIsSavingProfile(false);
      toast({ title: "Profile updated", description: "Your personal information has been saved.", variant: "success" });
    }, 800);
  }

  function handleSavePassword(event: React.FormEvent) {
    event.preventDefault();
    if (!passwords.next || !passwords.confirm) {
      setPasswordError("Please fill in both new password fields.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordError(null);
    setIsSavingPassword(true);
    window.setTimeout(() => {
      setIsSavingPassword(false);
      setPasswords({ current: "", next: "", confirm: "" });
      toast({ title: "Password updated", description: "Your password has been changed.", variant: "success" });
    }, 800);
  }

  function handleLogoutAllDevices() {
    toast({
      title: "Logged out of all devices",
      description: "You will need to sign in again on other devices.",
      variant: "success",
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <PageHeader title="Profile" description="Manage your personal information and security settings." />

      <Card variant="soft" className="p-6">
        <div className="flex items-center gap-5">
          <div className="group relative shrink-0">
            <Avatar name={CURRENT_USER.name} src={CURRENT_USER.avatarUrl} size="lg" className="size-20 text-xl" />
            <button
              type="button"
              onClick={() => toast({ title: "Photo upload coming soon" })}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-charcoal/60 opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
            >
              <Camera className="size-5 text-ivory" />
              <span className="sr-only">Change photo</span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl text-charcoal">{CURRENT_USER.name}</h2>
              <Badge variant="gold" className="capitalize">
                {CURRENT_USER.role}
              </Badge>
            </div>
            <p className="text-sm text-charcoal-soft">{CURRENT_USER.email}</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSaveProfile}>
        <FormSection title="Personal info" description="Update your name, email, and phone number.">
          <Input label="Full name" defaultValue={CURRENT_USER.name} />
          <Input label="Email address" type="email" defaultValue={CURRENT_USER.email} />
          <Input label="Phone number" type="tel" defaultValue="+1 (555) 010-2938" />
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSavingProfile}>
              Save changes
            </Button>
          </div>
        </FormSection>
      </form>

      <form onSubmit={handleSavePassword}>
        <FormSection title="Change password" description="Choose a strong password you don't use elsewhere.">
          <Input
            label="Current password"
            type="password"
            value={passwords.current}
            onChange={(event) => setPasswords((prev) => ({ ...prev, current: event.target.value }))}
          />
          <Input
            label="New password"
            type="password"
            value={passwords.next}
            onChange={(event) => setPasswords((prev) => ({ ...prev, next: event.target.value }))}
          />
          <Input
            label="Confirm new password"
            type="password"
            value={passwords.confirm}
            onChange={(event) => setPasswords((prev) => ({ ...prev, confirm: event.target.value }))}
            error={passwordError ?? undefined}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSavingPassword}>
              Update password
            </Button>
          </div>
        </FormSection>
      </form>

      <Card variant="flat" className="border-red-200 bg-red-50/40 p-6">
        <CardContent className="flex flex-col items-start gap-4 p-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <ShieldAlert className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-charcoal">Log out of all devices</p>
              <p className="text-sm text-charcoal-soft">
                This will sign you out everywhere except your current session.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogoutAllDevices}
          >
            Log out of all devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
