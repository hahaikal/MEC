import Link from "next/link";
import { MessageCircle, LogIn, Star, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL, HERO_IMG } from "./constants";
import { Blob } from "./blob";

export function Hero({ phone = "+62 812-7425-6077" }: { phone?: string }) {
  const cleanPhone = phone.replace(/\D/g, "");
  const dynamicWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Admin MEC, saya ingin konsultasi mengenai program kursus")}`;
  return (
    <section id="top" className="relative overflow-hidden">
      <Blob className="absolute -top-24 -left-24 h-96 w-96 opacity-[0.08]" color="primary" />
      <Blob className="absolute top-40 -right-32 h-[28rem] w-[28rem] opacity-[0.12]" color="accent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-16 md:pt-10 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-4 py-1.5 text-xs font-semibold text-foreground/80">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              Trusted by 300+ parents & students
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-foreground">
              Learn and Grow with us. {" "}
              <span className="relative inline-block">
                <span className="relative z-10">One-stop</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-accent/70 -z-0 rounded-sm" />
              </span>{" "}
              learning center.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
              My English Course & Academy is a warm, modern learning home for kids,
              teens, and adults. Speak with confidence, guided by certified tutors
              and a curriculum your child will actually love.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={dynamicWhatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-soft h-12 px-6 gap-2 w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link href="/parent-hub/login">
                <Button
                  size="lg"
                  className="rounded-full shadow-soft h-12 px-6 gap-2 w-full sm:w-auto"
                >
                  <LogIn className="h-4 w-4" />
                  Parent Hub Login
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "300+", l: "Active Students" },
                { v: "10+", l: "Certified Tutors" },
                { v: "98%", l: "Parent Satisfaction" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                    {s.v}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-accent" />
            <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-primary/15" />
            <div className="relative rounded-3xl overflow-hidden shadow-soft border border-border bg-card">
              <img
                src={HERO_IMG}
                alt="Students learning English"
                width={1280}
                height={1280}
                className="w-full h-[460px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 border border-border">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">New Term Begins</div>
                <div className="text-xs text-muted-foreground">July 6th</div>
              </div>
            </div>
            <div className="absolute -top-4 right-6 bg-accent text-accent-foreground rounded-full px-4 py-2 text-xs font-bold shadow-card">
              ✨ Enrollment Open
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
