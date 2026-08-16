"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "vamya-admin-auth";

function readAuthFlag() {
  try {
    return window.localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * UI-only mock auth guard. Not real security — just redirects to /login
 * when the demo `vamya-admin-auth` localStorage flag is absent, so the
 * dashboard shell can be demonstrated as a gated experience.
 *
 * Checks the flag inside an effect (after mount) rather than deriving it
 * synchronously via `useSyncExternalStore`'s server/client snapshot split:
 * that approach renders the server-matched "signed out" value first and
 * can fire the redirect effect on that value before the client-corrected
 * snapshot lands, bouncing already-authenticated users on a hard
 * navigation or refresh. Checking once, after mount, avoids the race.
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"checking" | "authed" | "guest">("checking");

  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       One-time read of an external system (localStorage) on mount, not a
       cascading-render pattern — eslint's check can't distinguish the two. */
    if (readAuthFlag()) {
      setStatus("authed");
    } else {
      setStatus("guest");
      router.replace("/login");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [router]);

  if (status !== "authed") return null;

  return <>{children}</>;
}

export { AuthGuard };
