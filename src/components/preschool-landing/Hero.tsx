"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Star4, Cloud, Balloon, ScallopEdge } from "./Doodles";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-primary-soft" aria-labelledby="hero-title">
      <Cloud className="absolute left-4 top-40 w-20 text-primary/40 md:left-1/3 md:top-32" />
      <Cloud className="absolute right-10 top-16 w-14 text-primary/30 md:right-[15%]" />
      <Star4 className="absolute left-1/2 top-8 w-6 text-accent" />
      <Balloon className="absolute bottom-12 right-12 w-8 text-primary/50 md:right-32 md:bottom-24" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-8 md:grid-cols-2 md:px-6 md:pb-16 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            <Star4 className="w-3.5" />
            Kindergarten &amp; Baby Care
          </span>
          <h1 id="hero-title" className="mt-5 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="block relative z-10">Kids&apos; Bright</span>
            <span className="relative inline-block text-primary mt-1 z-10">
              Future
            </span>
            <br />
            <span className="block mt-1 relative z-10">Starts Here</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            MEC Preschool helps your little one grow confidently through fun, safe, and loving English learning — from their very first steps.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 relative z-10">
            <a
              href="#classes"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Apply Today
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center gap-3 text-sm font-bold text-foreground"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-background text-primary shadow-md transition-transform hover:scale-105">
                <Play className="size-4 fill-current ml-1" />
              </span>
              Watch MEC
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="blob-frame relative bg-accent">
            <img
              src="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=800&h=800&fit=crop"
              alt="MEC Preschool student smiling while holding a book"
              width={800}
              height={800}
              className="relative z-10 w-full object-cover"
            />
          </div>
          <Star4 className="absolute -left-6 top-8 w-8 text-primary" />
          <Star4 className="absolute -right-4 bottom-16 w-10 text-accent" />
          <motion.div
            className="absolute -left-4 bottom-8 z-20 rounded-2xl bg-background px-4 py-3 shadow-xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="font-display text-xl font-bold text-primary">15+</p>
            <p className="text-xs font-semibold text-muted-foreground">Years Experience</p>
          </motion.div>
        </motion.div>
      </div>

      <ScallopEdge className="absolute bottom-0 left-0 h-10 w-full text-background" />
    </section>
  );
}
