import { GraduationCap, Users, ShieldCheck } from "lucide-react";

export function WhyUs() {
  const items = [
    {
      icon: GraduationCap,
      title: "Certified Curriculum",
      desc: "Built on CEFR standards and adapted for Indonesian learners.",
      color: "primary",
    },
    {
      icon: Users,
      title: "Small Class Sizes",
      desc: "Max 10 students per group — real attention, real progress.",
      color: "accent",
    },
    {
      icon: ShieldCheck,
      title: "Parent Hub Tracking",
      desc: "See attendance, reports, and tutor feedback any time.",
      color: "primary",
    },
  ];
  return (
    <section id="why" className="relative py-20 md:py-24 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Why Choose MEC
        </div>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground max-w-2xl mx-auto">
          A learning home parents trust.
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-card border border-border p-7 shadow-card text-left"
            >
              <div
                className={
                  "grid h-14 w-14 place-items-center rounded-2xl " +
                  (f.color === "accent"
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground")
                }
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
