"use client";

import * as React from "react";
import { Ban, CheckCircle2, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { InviteUserModal, type InviteUserFormData } from "@/components/users/InviteUserModal";
import { ADMIN_USERS } from "@/lib/mock-data/users";
import type { AdminUser } from "@/lib/types/admin-user";
import { formatDate } from "@/lib/utils";

const ROLE_BADGE_VARIANT: Record<AdminUser["role"], BadgeProps["variant"]> = {
  admin: "gold",
  manager: "success",
  support: "outline",
};

const ROLE_LABEL: Record<AdminUser["role"], string> = {
  admin: "Admin",
  manager: "Manager",
  support: "Support",
};

function UsersPageContent() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<AdminUser[]>(ADMIN_USERS);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [suspendTarget, setSuspendTarget] = React.useState<AdminUser | null>(null);

  function handleInvite(data: InviteUserFormData) {
    const newUser: AdminUser = {
      id: `staff-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "invited",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    toast({
      title: "Invitation sent",
      description: `${data.name} has been invited as ${ROLE_LABEL[data.role]}.`,
      variant: "success",
    });
  }

  function handleRoleChange(user: AdminUser, role: AdminUser["role"]) {
    if (role === user.role) return;
    setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, role } : entry)));
    toast({
      title: "Role updated",
      description: `${user.name} is now ${ROLE_LABEL[role]}.`,
      variant: "success",
    });
  }

  function handleReactivate(user: AdminUser) {
    setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, status: "active" } : entry)));
    toast({
      title: "User reactivated",
      description: `${user.name} can access the dashboard again.`,
      variant: "success",
    });
  }

  function handleSuspendConfirm() {
    if (!suspendTarget) return;
    setUsers((prev) =>
      prev.map((entry) => (entry.id === suspendTarget.id ? { ...entry, status: "suspended" } : entry)),
    );
    toast({
      title: "User suspended",
      description: `${suspendTarget.name}'s access has been revoked.`,
      variant: "success",
    });
    setSuspendTarget(null);
  }

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <span className="font-medium text-charcoal">{user.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user) => <span className="text-charcoal-soft">{user.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (user) => <Badge variant={ROLE_BADGE_VARIANT[user.role]}>{ROLE_LABEL[user.role]}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (user) => <StatusBadge domain="user" status={user.status} />,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      render: (user) => <span className="text-charcoal-soft">{formatDate(user.lastLoginAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <Select
            aria-label={`Change role for ${user.name}`}
            value={user.role}
            onChange={(event) => handleRoleChange(user, event.target.value as AdminUser["role"])}
            className="h-9 w-28 px-2.5 pr-7 text-xs"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="support">Support</option>
          </Select>
          {user.status === "suspended" ? (
            <Button size="sm" variant="outline" onClick={() => handleReactivate(user)}>
              <CheckCircle2 className="size-4" />
              Reactivate
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setSuspendTarget(user)}>
              <Ban className="size-4" />
              Suspend
            </Button>
          )}
        </div>
      ),
    },
  ];

  const isSuspendingAdmin = suspendTarget?.role === "admin";

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage staff access to the House of Vamya admin dashboard."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Invite User
          </Button>
        }
      />

      <DataTable columns={columns} data={users} getRowKey={(user) => user.id} />

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} onInvite={handleInvite} />

      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title={isSuspendingAdmin ? "Suspend admin access?" : `Suspend ${suspendTarget?.name ?? "user"}?`}
        description={
          isSuspendingAdmin
            ? `${suspendTarget?.name} is an Admin with full platform access. Suspending them immediately revokes all administrative privileges — make sure this is intended before continuing.`
            : "They will immediately lose access to the admin dashboard. You can reactivate them at any time."
        }
        confirmLabel="Suspend"
        variant="danger"
        onConfirm={handleSuspendConfirm}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <ToastProvider>
      <UsersPageContent />
    </ToastProvider>
  );
}
