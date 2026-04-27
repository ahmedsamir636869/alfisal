"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import type { Locale } from "@/lib/i18n";

type NavLink = { label: string; href: string };

interface NavShellProps {
  brandName: string;
  logoUrl: string;
  logoAlt: string;
  logoSize?: number;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  activeLocale: Locale;
  serverPath: string;
}

export default function NavShell({
  brandName,
  logoUrl,
  logoAlt,
  logoSize = 32,
  links,
  ctaLabel,
  ctaHref,
  activeLocale,
  serverPath,
}: NavShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute = pathname || serverPath || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const normalizePath = (path: string) => {
    const clean = path.split("?")[0].replace(/\/+$/, "");
    return clean || "/";
  };

  const isActive = (href: string) => {
    const current = normalizePath(activeRoute);
    const target = normalizePath(href);
    return target === "/" ? current === "/" : current === target || current.startsWith(`${target}/`);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] bg-[var(--color-ink)] text-[var(--color-bone)] px-4 py-2 text-xs font-medium tracking-wider uppercase"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled
            ? "bg-[color-mix(in_oklab,var(--color-bone)_92%,transparent)] backdrop-blur-md border-b border-[var(--color-hairline)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label={`${brandName} — home`}
            >
              <div
                className="relative overflow-hidden"
                style={{ height: logoSize, width: logoSize }}
              >
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-[1.35rem] leading-none text-[var(--color-ink)] tracking-tight">
                {brandName}
                <span className="text-[var(--color-saffron-deep)]">.</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="group relative px-4 py-2 text-[13px] tracking-wide text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="relative inline-block">
                      {l.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-px bg-[var(--color-ink)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <LocaleSwitcher active={activeLocale} currentPath={activeRoute} />
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-bone)] px-5 py-2.5 text-[12px] font-medium tracking-[0.08em] uppercase hover:bg-[var(--color-saffron-deep)] transition-colors duration-300"
              >
                {ctaLabel}
                <span
                  aria-hidden
                  className="material-symbols-outlined text-[16px] transition-transform duration-500 group-hover:translate-x-0.5"
                >
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-1.5">
              <LocaleSwitcher
                active={activeLocale}
                currentPath={activeRoute}
                variant="header-mobile"
              />
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="h-11 w-11 flex items-center justify-center text-[var(--color-ink)]"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                <span className="material-symbols-outlined text-[26px]">menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          aria-label="Close menu backdrop"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-[color-mix(in_oklab,var(--color-ink)_35%,transparent)] backdrop-blur-sm"
        />
        <div
          className={`absolute inset-y-0 right-0 w-[88%] max-w-md bg-[var(--color-bone)] border-l border-[var(--color-hairline)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-20 px-6 border-b border-[var(--color-hairline)]">
            <span className="font-display text-xl text-[var(--color-ink)]">
              {brandName}
              <span className="text-[var(--color-saffron-deep)]">.</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-11 w-11 flex items-center justify-center text-[var(--color-ink)]"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[26px]">close</span>
            </button>
          </div>

          <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-6 py-6">
            <ol className="space-y-0">
              {links.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-4 min-h-[52px] py-3 border-b border-[var(--color-hairline)]/70 transition-colors active:bg-[var(--color-parchment)] ${
                        active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"
                      }`}
                    >
                      <span className="font-mono text-[11px] text-[var(--color-muted)] tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="font-display text-2xl leading-none">{l.label}</span>
                      {active && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-[var(--color-saffron-deep)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] border-t border-[var(--color-hairline)]">
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-bone)] min-h-[48px] py-3.5 text-[12px] font-medium tracking-[0.08em] uppercase active:bg-[var(--color-saffron-deep)] transition-colors"
            >
              {ctaLabel}
              <span aria-hidden className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
            <LocaleSwitcher
              active={activeLocale}
              currentPath={activeRoute}
              variant="mobile"
            />
          </div>
        </div>
      </div>
    </>
  );
}
