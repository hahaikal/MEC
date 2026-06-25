import Link from "next/link";
import Image from "next/image";
import { Sparkles, Instagram, Facebook, Youtube, Phone, Mail, MapPin, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "./constants";

function Tiktok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="MEC Academy Logo"
                width={80}
                height={80}
              />
              <span className="font-display font-extrabold text-lg text-foreground">
                My English Course & Academy
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Learn and Grow with us. One-stop learning center
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Instagram, href: "https://instagram.com/myenglishcoursebaganbatu", label: "Instagram" },
                { Icon: Tiktok, href: "https://tiktok.com/@myenglishcoursebaganbatu", label: "Tiktok" },
                { Icon: MessageCircle, href: WHATSAPP_URL, label: "WhatsApp" },
                { Icon: Facebook, href: "https://facebook.com/myenglishcoursebaganbatu", label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-card border border-border text-foreground/70 hover:text-primary hover:border-primary transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold text-foreground">Explore</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary">About</a></li>
              <li><a href="#programs" className="hover:text-primary">Programs</a></li>
              <li><a href="#why" className="hover:text-primary">Why MEC</a></li>
              <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground">Get in touch</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  +62 812-3087-1923
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                myenglishcoursebaganbatu@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                Jl. Lancang Kuning Bagan Batu, Kec. Bagan Sinembah, Rokan Hilir
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground">Parent Hub</div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already enrolled? Sign in to track your child's progress.
            </p>
            <Link href="/parent-hub/login">
              <Button className="mt-4 rounded-full w-full gap-2">
                <LogIn className="h-4 w-4" /> Parent Hub Login
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} My English Course & Academy. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
