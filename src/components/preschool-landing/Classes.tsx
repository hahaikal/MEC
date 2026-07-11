"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Star4, Cloud } from "./Doodles";

const classes = [
  {
    title: "Nursery",
    age: "1–2 years",
    desc: "Your little one's first sensory and motor stimulation in a warm, loving environment.",
    img: "/images/placeholder-5.JPG",
    alt: "Toddlers playing with colorful blocks in MEC Nursery class",
    bg: "bg-primary",
    text: "text-primary-foreground",
    badge: "bg-accent text-accent-foreground",
  },
  {
    title: "Preschool",
    age: "3–4 years",
    desc: "Learn first English vocabulary through daily songs, arts, and creative play.",
    img: "/images/placeholder-6.png",
    alt: "MEC Preschool children drawing together with crayons",
    bg: "bg-accent",
    text: "text-accent-foreground",
    badge: "bg-primary text-primary-foreground",
  },
  {
    title: "Kindergarten",
    age: "5–6 years",
    desc: "Primary school preparation with literacy, numeracy, and active English conversation.",
    img: "/images/placeholder-7.png",
    alt: "MEC Kindergarten students raising hands in English class",
    bg: "bg-primary-deep",
    text: "text-primary-foreground",
    badge: "bg-accent text-accent-foreground",
  },
];

export function Classes() {
  return (
    <section id="classes" className="relative overflow-hidden bg-muted py-20 md:py-28" aria-labelledby="classes-title">
      <Cloud className="absolute left-10 top-12 w-16 text-primary/30" />
      <Star4 className="absolute right-12 top-16 w-7 text-accent" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Our Programs
          </span>
          <h2 id="classes-title" className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Age &amp; Stage <span className="text-primary">Appropriate</span> Classes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three learning levels designed to follow your little one's development.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {classes.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className={`pill-card ${c.bg} ${c.text} px-6 pb-8 pt-6 text-center shadow-xl`}
            >
              <div className="blob-frame mx-auto w-40 bg-background/20">
                <img
                  src={c.img}
                  alt={c.alt}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </div>
              <span className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-bold ${c.badge}`}>
                {c.age}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{c.desc}</p>
              <a
                href="#footer"
                className="mt-5 inline-flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-110"
                aria-label={`Register for ${c.title} class`}
              >
                <ArrowRight className="size-4" />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
