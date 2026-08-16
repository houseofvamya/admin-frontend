"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "vamya-admin-sidebar-collapsed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

/**
 * Persists the sidebar's collapsed/expanded state to localStorage.
 * Uses `useSyncExternalStore` (rather than an effect + setState) so reading
 * the persisted value on mount doesn't trigger a cascading render, and so
 * the server-rendered markup (always "expanded") matches the first client
 * paint before the real, persisted value takes over.
 *
 * A plain hook (no Context) is sufficient since only the Sidebar itself
 * needs this state — Topbar and DashboardShell use a flex layout that
 * doesn't need to know the sidebar's width.
 */
export function useSidebarState() {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleCollapsed = useCallback(() => {
    try {
      const next = window.localStorage.getItem(STORAGE_KEY) !== "true";
      window.localStorage.setItem(STORAGE_KEY, String(next));
      // The native `storage` event only fires in *other* tabs/windows, so
      // dispatch it manually to notify this window's own subscribers.
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    } catch {
      // Ignore storage failures (e.g. private browsing).
    }
  }, []);

  return { collapsed, toggleCollapsed };
}
