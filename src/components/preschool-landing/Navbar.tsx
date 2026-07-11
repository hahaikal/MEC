"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#why" },
  { label: "Programs", href: "#classes" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#footer" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

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

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+622112345678"
            className="flex items-center gap-2 text-sm font-semibold text-foreground/70"
          >
            <Phone className="size-4 text-primary" />
            +62 21 1234 5678
          </a>
          <a
            href="#footer"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5"
          >
            Apply Now
          </a>
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
            href="#footer"
            onClick={() => setOpen(false)}
            className="mt-2 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground"
          >
            Apply Now
          </a>
        </nav>
      )}
    </header>
  );
}
