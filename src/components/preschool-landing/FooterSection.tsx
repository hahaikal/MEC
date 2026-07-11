import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { ScallopEdge, Star4 } from "./Doodles";

export function FooterSection() {
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
              My English Course Preschool — The place where your little one learns English in the most fun way.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#footer"
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
              <li><a href="#classes" className="hover:text-accent">Nursery (1–2 yrs)</a></li>
              <li><a href="#classes" className="hover:text-accent">Preschool (3–4 yrs)</a></li>
              <li><a href="#classes" className="hover:text-accent">Kindergarten (5–6 yrs)</a></li>
            </ul>
          </nav>

          <address className="not-italic">
            <h3 className="font-display text-lg font-bold text-accent">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm opacity-90">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                Jl. Pendidikan No. 123, Jakarta Selatan
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-accent" />
                <a href="tel:+622112345678" className="hover:text-accent">+62 21 1234 5678</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-accent" />
                <a href="mailto:hello@mecpreschool.id" className="hover:text-accent">hello@mecpreschool.id</a>
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
