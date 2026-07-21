"use client";

import { motion } from "framer-motion";
import { Star4, DotsGrid, Cloud } from "./Doodles";

const photos = [
  {
    src: "/images/preschool10.png",
    alt: "Two children reading a storybook together at MEC Preschool",
    frame: "bg-accent",
    rotate: "-rotate-3",
    span: "",
  },
  {
    src: "/images/preschool6.jpeg",
    alt: "Student birthday celebration in MEC Preschool class",
    frame: "bg-primary",
    rotate: "rotate-2",
    span: "",
  },
  {
    src: "/images/preschool9.jpeg",
    alt: "MEC student drawing with colored pencils in art class",
    frame: "bg-background",
    rotate: "",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/images/preschool7.jpeg",
    alt: "MEC Preschool children taking a group photo while hugging",
    frame: "bg-primary",
    rotate: "rotate-3",
    span: "",
  },
  {
    src: "/images/preschool8.jpeg",
    alt: "MEC students playing superhero dress-up on costume day",
    frame: "bg-accent",
    rotate: "-rotate-2",
    span: "",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-background py-20 md:py-28" aria-labelledby="gallery-title">
      <Cloud className="absolute right-8 top-14 w-16 text-primary/30" />
      <DotsGrid className="absolute bottom-16 left-6 w-14 text-accent" />
      <Star4 className="absolute left-1/4 top-12 w-6 text-primary" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Our Moments
          </span>
          <h2 id="gallery-title" className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Wake a <span className="text-primary">Genius</span> in a Child
          </h2>
          <p className="mt-4 text-muted-foreground">
            The joy of learning and playing every day at MEC Preschool.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {photos.map((p, i) => (
            <motion.figure
              key={p.alt}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.04, rotate: 0 }}
              className={`${p.span} ${p.rotate} ${p.frame} aspect-square rounded-2xl p-2 shadow-lg`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full rounded-xl object-cover"
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
