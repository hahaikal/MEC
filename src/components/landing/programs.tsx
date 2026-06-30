import { Baby, Library, Mic, BookOpen, Calculator, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "./constants";

export function Programs({ phone = "+62 812-7425-6077" }: { phone?: string }) {
  const cleanPhone = phone.replace(/\D/g, "");
  const dynamicWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Admin MEC, saya ingin konsultasi mengenai program kursus")}`;
  const programs = [
    {
      tag: "Ages 2–6",
      title: "MEC PRESCHOOL",
      desc: "Fun, interactive, and play-based early English learning to build confidence from the very start.",
      icon: Baby,
      featured: false,
    },
    {
      tag: "ALL AGES & LEVELS",
      title: "Regular English Class",
      desc: "Comprehensive English programs tailored for all school levels and university students to master grammar, reading, and writing,",
      icon: Library,
      featured: true,
    },
    {
      tag: "SPEAKING CLASS",
      title: "Foresight Class",
      desc: "Dynamic speaking-focused sessions designed to boost conversational fluency, public speaking, and real-world confidence.",
      icon: Mic,
      featured: false,
    },
    {
      tag: "Early Literacy",
      title: "Calistung",
      desc: "Specialized program focusing on early Reading, Writing, and Arithmetic (Membaca, Menulis, Berhitung) to prepare children for primary school.",
      icon: BookOpen,
      featured: false,
    },
    {
      tag: "ACADEMIC SUPPORT",
      title: "Bimbel",
      desc: "Academic tutoring program to help students excel in their school subjects and prepare for major examinations.",
      icon: Calculator,
      featured: false,
    },
  ];

  return (
    <section id="programs" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Our Programs
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Programs tailored to every stage of learning.
          </h2>
          <p className="mt-3 text-muted-foreground">
            From first words to fluent conversations and exam-ready confidence.
            there's a perfect class for every learner at MEC.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p) => {
            const featured = p.featured;
            return (
              <div
                key={p.title}
                className={[
                  "group rounded-3xl p-6 border transition-all hover:-translate-y-1",
                  featured
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card border-border shadow-card hover:shadow-soft",
                ].join(" ")}
              >
                <div
                  className={[
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    featured ? "bg-accent text-accent-foreground" : "bg-accent/30 text-foreground",
                  ].join(" ")}
                >
                  <p.icon className="h-6 w-6" />
                </div>
                <div
                  className={[
                    "mt-5 inline-block text-[11px] font-semibold uppercase tracking-wider rounded-full px-3 py-1",
                    featured ? "bg-primary-foreground/15" : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {p.tag}
                </div>
                <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
                <p
                  className={[
                    "mt-2 text-sm",
                    featured ? "text-primary-foreground/85" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {p.desc}
                </p>
                <a
                  href={dynamicWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "mt-6 inline-flex items-center gap-1 text-sm font-semibold",
                    featured ? "text-accent" : "text-primary",
                  ].join(" ")}
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
