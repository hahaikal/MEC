"use client";

import { motion } from "framer-motion";
import { Heart, Lightbulb, Shield, Sparkles, Smile } from "lucide-react";
import { Star4, DotsGrid } from "./Doodles";

const values = [
  {
    icon: Sparkles,
    title: "Confidence",
    desc: "We empower every child to believe in themselves, express their ideas, take on new challenges, and become independent learners in a safe and supportive environment.",
    color: "bg-primary text-primary-foreground"
  },
  {
    icon: Lightbulb,
    title: "Curiosity",
    desc: "We inspire children to ask questions, explore, discover, and develop a lifelong love for learning through meaningful and hands-on experiences.",
    color: "bg-accent text-accent-foreground"
  },
  {
    icon: Shield,
    title: "Character",
    desc: "We nurture integrity, responsibility, respect, and resilience, helping children grow into kind, responsible, and respectful individuals.",
    color: "bg-secondary text-secondary-foreground border border-border"
  },
  {
    icon: Smile,
    title: "Creativity",
    desc: "We encourage children to think imaginatively, solve problems, and express themselves confidently through play, exploration, and innovation.",
    color: "bg-[#ffd43b] text-[#2c2b2b]"
  },
  {
    icon: Heart,
    title: "Compassion",
    desc: "We foster empathy, kindness, and respect for others, teaching children to care for people and build meaningful friendship.",
    color: "bg-red-400 text-white"
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function CoreValues() {
  return (
    <section className="relative bg-[#f8f9fa] py-20 md:py-28 overflow-hidden">
      <Star4 className="absolute left-8 top-12 w-8 text-accent opacity-50" />
      <DotsGrid className="absolute right-8 bottom-12 w-16 text-primary opacity-30" />
      
      <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Our Foundation
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            MEC <span className="text-primary">Core Values</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Confidence &bull; Curiosity &bull; Character &bull; Creativity &bull; Compassion
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-center"
        >
          {values.map((v, i) => (
            <motion.div 
              key={v.title}
              variants={itemAnim}
              className={`relative rounded-3xl bg-white p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow ${
                i === 3 ? "lg:col-start-1 lg:ml-auto lg:mr-[-50%]" : ""
              } ${
                i === 4 ? "lg:col-start-3 lg:mr-auto lg:ml-[-50%]" : ""
              }`}
            >
              <div className={`mb-6 flex size-14 items-center justify-center rounded-2xl ${v.color}`}>
                <v.icon className="size-7" />
              </div>
              <h3 className="mb-3 font-display text-xl font-bold text-foreground">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
