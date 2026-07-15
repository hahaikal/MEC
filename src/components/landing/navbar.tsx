"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  MessageCircle,
  LogIn,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar({ phone = "+62 812-7425-6077" }: { phone?: string }) {
  const cleanPhone = phone.replace(/\D/g, "");
  const dynamicWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Admin MEC, saya ingin konsultasi mengenai program kursus")}`;
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about", label: "About" },
    { href: "#programs", label: "Programs" },
    { href: "#why", label: "Why MEC" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MEC Academy Logo"
              width={80}
              height={80}
              className="rounded-md"
            />
            <span className="font-display font-extrabold text-lg tracking-tight text-foreground hidden xl:block leading-tight">
              My English Course <br /> & Academy
            </span>
            <span className="font-display font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-foreground xl:hidden leading-tight">
              My English Course <br className="sm:hidden" /> & Academy<span className="text-primary">.</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 ml-auto mr-4 lg:mr-0">
            <Link href="/preschool">
              <Button variant="outline" className="rounded-full gap-2 border-primary text-primary hover:bg-primary/10 shadow-sm">
                <Sparkles className="h-4 w-4" />
                MEC Preschool
              </Button>
            </Link>
            <Link href="/parent-hub/login">
              <Button className="rounded-full gap-2 shadow-soft px-5">
                <LogIn className="h-4 w-4" />
                Parent Hub Login
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <div className="md:hidden flex flex-col gap-2 mt-2">
              <Link href="/preschool">
                <Button variant="outline" className="w-full rounded-full gap-2 border-primary text-primary">
                  <Sparkles className="h-4 w-4" /> MEC Preschool
                </Button>
              </Link>
              <Link href="/parent-hub/login">
                <Button className="w-full rounded-full gap-2">
                  <LogIn className="h-4 w-4" /> Parent Hub Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
