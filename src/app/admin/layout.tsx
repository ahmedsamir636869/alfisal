"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const supabase = createClient();
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        // Clear any stale session cookies so the next login starts clean.
        await supabase.auth.signOut({ scope: "local" });
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      // AuthApiError — refresh token invalid / not found.
      // Wipe the broken session silently so the login form appears.
      try { await supabase.auth.signOut({ scope: "local" }); } catch { /* noop */ }
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
    } else {
      setIsAuthenticated(true);
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  }

  if (loading) {
    return (
      <div dir="ltr" className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-[1.5px] border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--admin-text-muted)] text-[10px] tracking-[0.3em] uppercase font-mono">
            Loading control room
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div dir="ltr" className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center p-6 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #84a3c8 1px, transparent 1px), linear-gradient(to bottom, #84a3c8 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="w-full max-w-md relative">
          <div className="flex items-center justify-between mb-8 text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--admin-text-muted)]">
            <span>Alfisal</span>
            <span>Control room</span>
          </div>

          <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] p-10">
            <div className="mb-10">
              <div className="text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--admin-accent)] mb-6">
                01 — Restricted access
              </div>
              <h1 className="text-3xl text-white tracking-tight font-display">
                Sign in to the studio CMS.
              </h1>
              <p className="text-[var(--admin-text-muted)] mt-4 text-sm leading-relaxed max-w-[40ch]">
                Every word and image on alfisalcon.com is edited from this
                console. Authorised editors only.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono text-[var(--admin-text-muted)] uppercase tracking-[0.3em] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b border-white/15 text-white placeholder-[var(--admin-text-dim)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
                  placeholder="editor@alfisalcon.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[var(--admin-text-muted)] uppercase tracking-[0.3em] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b border-white/15 text-white placeholder-[var(--admin-text-dim)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="border-l-2 border-[var(--color-danger)] pl-4 py-1 text-[var(--color-danger)] text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="group mt-4 w-full inline-flex items-center justify-between gap-3 bg-[var(--admin-accent)] text-[var(--admin-bg)] py-4 px-5 text-[11px] uppercase tracking-[0.25em] font-mono hover:bg-[var(--admin-accent-dark)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    <span>Enter the studio</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[var(--admin-text-dim)] text-[10px] font-mono tracking-[0.25em] uppercase mt-8">
            Protected area · editors only
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Overview", icon: "dashboard", code: "00" },
    { href: "/admin/navigation", label: "Navigation", icon: "menu", code: "01" },
    { href: "/admin/hero", label: "Hero", icon: "featured_video", code: "02" },
    { href: "/admin/values", label: "Principles", icon: "star", code: "03" },
    { href: "/admin/projects", label: "Projects", icon: "photo_library", code: "04" },
    { href: "/admin/services", label: "Services", icon: "build", code: "05" },
    { href: "/admin/about", label: "Studio", icon: "info", code: "06" },
    { href: "/admin/contact", label: "Contact", icon: "contact_mail", code: "07" },
    { href: "/admin/cta", label: "CTA band", icon: "campaign", code: "08" },
    { href: "/admin/footer", label: "Footer", icon: "bottom_navigation", code: "09" },
    { href: "/admin/submissions", label: "Inbox", icon: "inbox", code: "10" },
  ];

  return (
    <div dir="ltr" className="min-h-screen bg-[var(--admin-bg)] flex text-white selection:bg-[var(--admin-accent)]/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--admin-surface)] border-r border-[var(--admin-border)] flex flex-col fixed h-full z-50 left-0">
        <div className="px-7 pt-8 pb-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-4">
            Alfisal · CMS
          </div>
          <h2 className="text-white text-2xl tracking-tight font-display">
            Control room
          </h2>
        </div>

        <div className="mx-7 h-px bg-[var(--admin-border)]" />

        <nav className="flex-1 px-4 py-6 space-y-[2px] overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 pl-4 pr-3 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-accent)] ${
                  isActive
                    ? "bg-[var(--admin-accent)]/10 text-white"
                    : "text-[var(--admin-text-soft)] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`font-mono text-[10px] tracking-widest w-6 ${
                    isActive
                      ? "text-[var(--admin-accent)]"
                      : "text-[var(--admin-text-dim)]"
                  }`}
                >
                  {item.code}
                </span>
                <span className="flex-1">{item.label}</span>
                <span
                  aria-hidden
                  className={`h-px w-5 transition-all ${
                    isActive
                      ? "bg-[var(--admin-accent)] w-8"
                      : "bg-white/10 group-hover:bg-white/30"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="px-7 py-6 border-t border-[var(--admin-border)] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em]">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--admin-text-soft)] hover:text-white transition-colors"
          >
            <span aria-hidden>↗</span>
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="text-[var(--admin-text-soft)] hover:text-[var(--color-danger)] transition-colors cursor-pointer focus-visible:outline-none"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main — always LTR, offset from the left sidebar */}
      <main className="flex-1 ml-72 p-10 md:p-14 animate-fade-in min-w-0">
        {children}
      </main>
    </div>
  );
}
