import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { ScallopEdge, Star4 } from "./Doodles";

const TikTokIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M12.53.02C13.84 0 15.14.01 16.44.06c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v8.12c0 4.32-3.4 7.9-7.7 8.01-4.43.12-8.31-3.32-8.52-7.72-.22-4.57 3.32-8.52 7.89-8.57v4.13c-2.3.06-4.22 2.05-4.13 4.36.09 2.2 1.95 3.99 4.15 4.02 2.18.02 4.02-1.74 4.02-3.92V.02h-3.8z" />
  </svg>
);

export function FooterSection({ 
  phone = "+62 812-7425-6077",
  email = "hello@mecpreschool.id",
  address = "Jl. Lancang Kuning Bagan Batu, Kec. Bagan Sinembah, Rokan Hilir"
}: { 
  phone?: string;
  email?: string;
  address?: string;
}) {
  const cleanPhone = phone.replace(/\D/g, "");

  return (
    <footer id="footer" className="relative bg-primary-deep text-primary-foreground">
      <ScallopEdge className="h-10 w-full text-muted" flip={true} />
      <div className="relative">
        <Star4 className="absolute right-12 top-10 w-7 text-accent" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent font-display text-lg font-bold text-accent-foreground">
                M
              </span>
              <span className="font-display text-xl font-bold">
                MEC <span className="text-accent">Preschool</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              MEC Preschool is a premium preschool with strong English exposure, an international approach alongside Kurikulum Merdeka, and a focus on independence, confidence, character, holistic development, and preparing children for a global future.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/myenglishcoursebb/", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/myenglishcoursebaganbatu/", label: "Instagram" },
                { icon: TikTokIcon, href: "https://tiktok.com/@myenglishcoursebaganbatu", label: "Tiktok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-display text-lg font-bold text-accent">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm opacity-90">
              <li><a href="#home" className="hover:text-accent">Home</a></li>
              <li><a href="#why" className="hover:text-accent">About Us</a></li>
              <li><a href="#classes" className="hover:text-accent">Programs</a></li>
              <li><a href="#gallery" className="hover:text-accent">Gallery</a></li>
            </ul>
          </nav>

          <nav aria-label="Programs">
            <h3 className="font-display text-lg font-bold text-accent">Programs</h3>
            <ul className="mt-4 space-y-2.5 text-sm opacity-90">
              <li><a href="#classes" className="hover:text-accent">Nursery (2-3 yrs)</a></li>
              <li><a href="#classes" className="hover:text-accent">Pre-Kindergarten (3–4 yrs)</a></li>
              <li><a href="#classes" className="hover:text-accent">Kindergarten (5–6 yrs)</a></li>
            </ul>
          </nav>

          <address className="not-italic">
            <h3 className="font-display text-lg font-bold text-accent">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm opacity-90">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="max-w-[200px]">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-accent" />
                <a href={`tel:${cleanPhone}`} className="hover:text-accent">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-accent" />
                <a href={`mailto:${email}`} className="hover:text-accent break-all">{email}</a>
              </li>
            </ul>
          </address>
        </div>

        <div className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-70">
          © {new Date().getFullYear()} MEC Preschool — My English Course. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
