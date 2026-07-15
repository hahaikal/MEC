"use client";

import { motion } from "framer-motion";
import { GraduationCap, Puzzle, ShieldCheck, Users, Phone, ArrowRight } from "lucide-react";
import { Star4, DotsGrid } from "./Doodles";

const features = [
  { icon: GraduationCap, label: "English Native Approach" },
  { icon: Puzzle, label: "Fun Play Curriculum" },
  { icon: ShieldCheck, label: "Safe & Clean Environment" },
  { icon: Users, label: "Small & Personalized Classes" },
];

export function WhyChoose({ phone = "+62 812-7425-6077" }: { phone?: string }) {
  const cleanPhone = phone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Admin MEC, saya ingin konsultasi mengenai program MEC Preschool")}`;

  return (
    <section id="why" className="relative bg-background py-20 md:py-28" aria-labelledby="why-title">
      <DotsGrid className="absolute right-8 top-10 w-14 text-accent" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="blob-frame-alt bg-primary-soft p-3">
            <img
              src="/images/preschool2.jpeg"
              alt="MEC Preschool teacher reading a storybook to children"
              width={900}
              height={900}
              loading="lazy"
              className="blob-frame-alt w-full object-cover"
            />
          </div>
          <Star4 className="absolute -left-4 -top-4 w-9 text-accent" />
          <Star4 className="absolute -bottom-2 right-6 w-6 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            About Us
          </span>
          <h2 id="why-title" className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Why Choose <span className="text-primary">MEC Preschool?</span>
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We believe every child is a star. With play-based learning methods and daily English exposure, your child grows smart, confident, and happy.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-3 rounded-full border border-border bg-secondary px-4 py-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <f.icon className="size-4" />
                </span>
                <span className="text-sm font-bold text-foreground">{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Read More
              <ArrowRight className="size-4" />
            </a>
            <a href={`tel:${cleanPhone}`} className="flex items-center gap-3 group">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform group-hover:scale-110">
                <Phone className="size-4" />
              </span>
              <span>
                <span className="block text-xs font-semibold text-muted-foreground">Contact Us</span>
                <span className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors">{phone}</span>
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
