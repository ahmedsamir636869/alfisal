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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
        await supabase.auth.signOut({ scope: "local" });
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch {
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

  /* ── Loading state ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <div dir="ltr" className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-[var(--admin-accent)]/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="text-[var(--admin-text-muted)] text-[10px] tracking-[0.3em] uppercase font-mono">
            Loading control room
          </span>
        </div>
      </div>
    );
  }

  /* ── Login screen ────────────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div dir="ltr" className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #84a3c8 1px, transparent 1px), linear-gradient(to bottom, #84a3c8 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Subtle radial glow behind form */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--admin-accent) 0%, transparent 70%)" }}
        />

        <div className="w-full max-w-md relative admin-page-enter">
          <div className="flex items-center justify-between mb-8 text-[10px] tracking-[0.3em] uppercase font-mono text-[var(--admin-text-muted)]">
            <span>Alfisal</span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--admin-accent)] animate-pulse" />
              Control room
            </span>
          </div>

          <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] p-8 sm:p-10" style={{ boxShadow: "var(--admin-shadow-lg)" }}>
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

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="admin-email" className="block text-[10px] font-mono text-[var(--admin-text-muted)] uppercase tracking-[0.3em] mb-2">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="admin-focus w-full px-0 py-3 bg-transparent border-b border-white/15 text-white placeholder-[var(--admin-text-dim)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors min-h-[44px]"
                  placeholder="editor@alfisalcon.com"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-[10px] font-mono text-[var(--admin-text-muted)] uppercase tracking-[0.3em] mb-2">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="admin-focus w-full px-0 py-3 bg-transparent border-b border-white/15 text-white placeholder-[var(--admin-text-dim)] focus:outline-none focus:border-[var(--admin-accent)] transition-colors min-h-[44px]"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div role="alert" className="flex items-start gap-3 bg-[var(--admin-danger-bg)] border border-[var(--admin-danger)]/20 px-4 py-3 text-[var(--admin-danger)] text-sm rounded-sm">
                  <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="admin-focus group mt-2 w-full inline-flex items-center justify-between gap-3 bg-[var(--admin-accent)] text-[var(--admin-bg)] py-4 px-5 text-[11px] uppercase tracking-[0.25em] font-mono hover:bg-[var(--admin-accent-dark)] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] active:scale-[0.98]"
              >
                {loginLoading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    <span>Enter the studio</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
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

  /* ── Navigation items ─────────────────────────────────────────────── */
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

  /* ── Authenticated layout ─────────────────────────────────────────── */
  return (
    <div dir="ltr" className="min-h-screen bg-[var(--admin-bg)] flex text-white selection:bg-[var(--admin-accent)]/30 selection:text-white">

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
        className="admin-focus lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-11 h-11 bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text-soft)] hover:text-white transition-colors active:scale-95"
        style={{ boxShadow: "var(--admin-shadow-md)" }}
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>

      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""} lg:hidden`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* Sidebar */}
      <aside
        className={`w-72 bg-[var(--admin-surface)] border-r border-[var(--admin-border)] flex flex-col fixed h-full z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ boxShadow: sidebarOpen ? "var(--admin-shadow-lg)" : "none" }}
      >
        <div className="px-7 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--admin-text-muted)] mb-3">
                Alfisal · CMS
              </div>
              <h2 className="text-white text-2xl tracking-tight font-display">
                Control room
              </h2>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              className="admin-focus lg:hidden flex items-center justify-center w-9 h-9 text-[var(--admin-text-soft)] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="mx-7 h-px bg-[var(--admin-border)]" />

        <nav className="flex-1 px-4 py-6 space-y-[2px] overflow-y-auto admin-scroll" aria-label="CMS sections">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-indicator admin-focus group flex items-center gap-3 pl-4 pr-3 py-3 text-sm transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? "active bg-[var(--admin-accent)]/10 text-white"
                    : "text-[var(--admin-text-soft)] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span
                  aria-hidden
                  className={`material-symbols-outlined text-[18px] transition-colors duration-200 ${
                    isActive ? "text-[var(--admin-accent)]" : "text-[var(--admin-text-dim)] group-hover:text-[var(--admin-text-soft)]"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                <span
                  className={`font-mono text-[10px] tracking-widest transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--admin-accent)]"
                      : "text-[var(--admin-text-dim)]"
                  }`}
                >
                  {item.code}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-5 border-t border-[var(--admin-border)] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="admin-focus flex items-center gap-3 px-3 py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-soft)] hover:text-white hover:bg-white/[0.04] transition-colors min-h-[44px] rounded-sm"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="admin-focus w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--admin-text-soft)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger-bg)] transition-colors cursor-pointer min-h-[44px] rounded-sm"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content — responsive offset */}
      <main className="flex-1 lg:ml-72 p-6 pt-16 lg:pt-10 sm:p-8 md:p-10 lg:p-14 admin-page-enter min-w-0">
        {children}
      </main>
    </div>
  );
}
