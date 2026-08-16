"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FadeIn } from "@/components/motion/FadeIn";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both an email and a password.");
      return;
    }

    setError(null);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      window.localStorage.setItem("vamya-admin-auth", "true");
    } catch {
      // Ignore storage failures — this is a demo guard, not real auth.
    }

    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-charcoal via-charcoal to-charcoal-soft px-12 lg:flex lg:w-[55%] lg:flex-col lg:justify-between lg:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)",
          }}
          aria-hidden
        />
        <div className="flex items-center gap-2 text-ivory">
          <Gem className="size-5 text-gold" />
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">Admin</span>
        </div>

        <FadeIn>
          <h1 className="font-display text-5xl italic text-ivory">House of Vamya</h1>
          <p className="mt-4 max-w-sm text-base text-ivory/70">Crafted for those who lead.</p>
        </FadeIn>

        <p className="text-xs text-ivory/40">
          &copy; {new Date().getFullYear()} House of Vamya. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-ivory px-6 py-12">
        <FadeIn className="w-full max-w-sm rounded-2xl border border-line bg-ivory p-8 shadow-elevated lg:border-none lg:p-0 lg:shadow-none">
          <div className="mb-8 flex flex-col gap-1 lg:hidden">
            <div className="mb-2 flex items-center gap-2 text-charcoal">
              <Gem className="size-5 text-gold-deep" />
              <span className="font-display text-2xl">House of Vamya</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl text-charcoal">Welcome back</h2>
            <p className="mt-2 text-sm text-charcoal-soft">Sign in to manage your storefront.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@houseofvamya.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-9 text-charcoal-soft transition-colors hover:text-charcoal"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-charcoal-soft">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="size-4 rounded border-line accent-gold-deep"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-gold-deep transition-colors hover:text-gold">
                Forgot password?
              </a>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="secondary" size="lg" isLoading={isLoading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-charcoal-soft">
            Demo access — any email and password combination signs you in.
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
