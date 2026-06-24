import { Star } from "lucide-react";

export function Testimonials() {
  const quotes = [
    {
      q: "My daughter went from shy to confidently presenting in English in just one term. The tutors truly care.",
      n: "Sarah W.",
      r: "Parent of Aisyah, Basic 3",
    },
    {
      q: "The Parent Hub is brilliant — I always know exactly how my son is doing without needing to ask.",
      n: "Andre P.",
      r: "Parent of Reza, Starter 4",
    },
    {
      q: "I passed my exam at School. thanks to MEC's coaching. The mock tests felt exactly like the real thing.",
      n: "Mira L.",
      r: "Foresight Student",
    },
  ];
  return (
    <section className="py-20 md:py-24 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Loved by parents & students.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {quotes.map((t) => (
            <div
              key={t.n}
              className="rounded-3xl bg-card border border-border p-7 shadow-card flex flex-col"
            >
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent" />
                ))}
              </div>
              <p className="mt-4 text-foreground/90 italic">"{t.q}"</p>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="font-semibold text-foreground text-sm">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
