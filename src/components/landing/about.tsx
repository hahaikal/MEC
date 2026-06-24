import { BookOpen, Users, ShieldCheck } from "lucide-react";
import { ABOUT_1, ABOUT_2 } from "./constants";
import { Blob } from "./blob";

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="rounded-3xl overflow-hidden shadow-card border border-border bg-card mt-10 h-72">
                <img
                  src={ABOUT_1}
                  alt="Teacher with students"
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-card border border-border bg-card h-72">
                <img
                  src={ABOUT_2}
                  alt="Student reading"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-soft">
              <div className="font-display text-3xl font-extrabold">5+</div>
              <div className="text-xs opacity-90">Years guiding learners</div>
            </div>
            <Blob className="absolute -z-10 -top-10 -right-10 h-56 w-56 opacity-[0.1]" color="accent" />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              About Us
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              A friendly academy where English feels like play.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We blend the best of modern language teaching, communicative practice,
              project-based learning, and real conversation with the warmth of a
              small, close-knit academy. Every student is seen, supported, and
              celebrated.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: BookOpen,
                  title: "Modern, communicative method",
                  desc: "Less drilling, more real conversation, stories, and projects.",
                },
                {
                  icon: Users,
                  title: "Small, caring classes",
                  desc: "Max 10 students per class so every voice gets heard.",
                },
                {
                  icon: ShieldCheck,
                  title: "Parent Hub transparency",
                  desc: "Track attendance, progress reports, and tutor notes in one place.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 rounded-2xl bg-card border border-border p-4 shadow-card"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{f.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
