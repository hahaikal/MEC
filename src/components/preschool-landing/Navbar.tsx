"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle, LogIn } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#why" },
  { label: "Programs", href: "#classes" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#footer" },
];

export function Navbar({ phone = "+62 812-7425-6077" }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const cleanPhone = phone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Admin MEC, saya ingin konsultasi mengenai program MEC Preschool")}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#home" className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
            M
          </span>
          <span className="font-display text-xl font-bold text-foreground">
            MEC <span className="text-primary">Preschool</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground/70 hover:bg-muted transition-colors">
              <MessageCircle className="size-4 text-primary" />
              WhatsApp
            </button>
          </a>
          <Link href="/parent-hub/login">
            <button className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5 flex items-center gap-2">
              <LogIn className="size-4" />
              Parent Hub Login
            </button>
          </Link>
        </div>

        <button
          className="rounded-full p-2 text-foreground lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 pb-6 pt-2 lg:hidden" aria-label="Mobile navigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-semibold text-foreground/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center gap-2 py-3 text-base font-semibold text-foreground/80"
          >
            <MessageCircle className="size-5 text-primary" />
            WhatsApp
          </a>
          <Link
            href="/parent-hub/login"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground"
          >
            <LogIn className="size-4" />
            Parent Hub Login
          </Link>
        </nav>
      )}
    </header>
  );
}
