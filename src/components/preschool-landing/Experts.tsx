"use client";

import { motion } from "framer-motion";
import { Star4 } from "./Doodles";

export interface Teacher {
  name: string;
  role: string;
  img: string;
}

interface ExpertsProps {
  teachers: Teacher[];
}

export function Experts({ teachers }: ExpertsProps) {
  // Use placeholder images if the teacher doesn't have a profile picture
  const defaultImages = [
    "/images/placeholder-1.png",
    "/images/placeholder-2.png",
    "/images/placeholder-5.JPG",
    "/images/placeholder-6.png",
  ];
  
  const frames = ["bg-primary-soft", "bg-accent"];

  return (
    <section id="experts" className="relative bg-muted py-20 md:py-28" aria-labelledby="experts-title">
      <Star4 className="absolute right-10 top-12 w-7 text-accent" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Our Experts
          </span>
          <h2 id="experts-title" className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            <span className="text-primary">Experienced </span> &amp; Loving Teachers
          </h2>
        </div>

        {teachers.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {teachers.map((t, i) => {
              const frameClass = frames[i % frames.length];
              const imgSrc = t.img || defaultImages[i % defaultImages.length];
              
              return (
                <motion.article
                  key={t.name + i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className={`pill-card ${frameClass} mx-auto shadow-lg`}>
                    <img
                      src={imgSrc}
                      alt={`${t.name}, ${t.role} at MEC Preschool`}
                      width={700}
                      height={800}
                      loading="lazy"
                      className="aspect-[7/8] w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{t.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">{t.role}</p>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 text-center text-muted-foreground p-8 border rounded-xl bg-background shadow-sm">
            Our expert teachers will be updated soon.
          </div>
        )}
      </div>
    </section>
  );
}
