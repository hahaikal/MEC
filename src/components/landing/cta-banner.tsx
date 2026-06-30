import Link from "next/link";
import { MessageCircle, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL, CTA_IMG } from "./constants";
import { Blob } from "./blob";

export function CTABanner({ phone = "+62 812-7425-6077" }: { phone?: string }) {
  const cleanPhone = phone.replace(/\D/g, "");
  const dynamicWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Admin MEC, saya ingin konsultasi mengenai program kursus")}`;
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground p-8 md:p-14 shadow-soft">
          <Blob className="absolute -top-20 -right-20 h-72 w-72 opacity-30" color="accent" />
          <Blob className="absolute -bottom-24 -left-16 h-72 w-72 opacity-15" color="accent" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Ready to start?
              </div>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Give your child the gift of confident English.
              </h2>
              <p className="mt-4 text-primary-foreground/85 max-w-lg">
                Chat with our team on WhatsApp for class schedules and a free
                placement test — or log into your Parent Hub to manage enrollment.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={dynamicWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 gap-2 w-full sm:w-auto"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </Button>
                </a>
                <Link href="/parent-hub/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-12 px-6 gap-2 w-full sm:w-auto bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <LogIn className="h-4 w-4" /> Parent Hub Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden border border-primary-foreground/20 shadow-card">
                <img
                  src={CTA_IMG}
                  alt="Happy student"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground rounded-2xl px-4 py-3 shadow-card">
                <div className="font-display text-2xl font-extrabold">Free</div>
                <div className="text-xs">Placement Test</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
