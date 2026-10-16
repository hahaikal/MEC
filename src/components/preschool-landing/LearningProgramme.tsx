"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Star4, DotsGrid, Cloud } from "./Doodles";

const programmes = [
  {
    title: "Nursery (Age 2–3 Years)",
    desc: "The Nursery programme focuses on helping children develop basic independence, confidence, and positive learning habits through fun and engaging activities. Children are introduced to early communication skills, sensory exploration, motor development, social interaction, and daily routines in a safe and nurturing environment.",
  },
  {
    title: "Pre-Kindergarten (Age 3–4 Years)",
    desc: "The Pre-Kindergarten programme encourages children to explore, express themselves, and develop curiosity through hands-on learning experiences. Children strengthen their language skills, early numeracy awareness, creativity, problem-solving skills, and social-emotional development through meaningful play and exploration.",
  },
  {
    title: "Kindergarten 1 (Age 4–5 Years)",
    desc: "Kindergarten 1 focuses on developing children’s readiness for formal education while continuing to provide engaging and developmentally appropriate experiences. At this level, children begin to experience more structured learning activities using selected learning resources based on the Indonesian Kurikulum Merdeka, while maintaining a balance between exploration and play.",
  },
  {
    title: "Kindergarten 2 (Age 5–6 Years)",
    desc: "Kindergarten 2 focuses on preparing children for their transition to primary school by strengthening academic readiness, independence, confidence, and essential learning skills. This level uses learning resources aligned with the Indonesian Kurikulum Merdeka, supporting children in developing early literacy, numeracy, communication skills, and learning habits needed for the next stage of education.",
  },
];

export function LearningProgramme() {
  return (
    <section
      id="learning-programme"
      className="relative overflow-hidden bg-muted py-20 md:py-28"
      aria-labelledby="learning-programme-title"
    >
      <Cloud className="absolute left-8 top-14 w-16 text-primary/30" />
      <Star4 className="absolute right-12 top-12 w-7 text-accent" />
      <DotsGrid className="absolute right-8 bottom-12 w-14 text-primary/25" />

      <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        {/* Header & Intro Text (PDF Page 9 Top) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Developmental Stages
            </span>
            <h2
              id="learning-programme-title"
              className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl"
            >
              Learning <span className="text-primary">Programme</span>
            </h2>
          </div>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90 md:text-lg">
            <p>
              At MEC Preschool, our learning programmes are designed according to
              children’s developmental stages, providing age-appropriate
              experiences that support their growth and learning journey. Each
              programme focuses on developing children’s foundational skills
              through exploration, play, interaction, and meaningful learning
              experiences.
            </p>
            <p>
              Our preschool levels consist of Nursery, Pre-Kindergarten,
              Kindergarten 1, and Kindergarten 2, with different learning focuses
              based on children’s needs and readiness.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-border/70 bg-background/80 p-5 space-y-2.5 text-xs italic leading-relaxed text-muted-foreground md:text-sm">
            <p>
              Di MEC Preschool, program pembelajaran kami dirancang sesuai dengan
              tahap perkembangan anak, dengan memberikan pengalaman belajar yang
              sesuai usia untuk mendukung pertumbuhan dan perjalanan belajar
              mereka. Setiap program berfokus pada pengembangan kemampuan dasar
              anak melalui eksplorasi, bermain, interaksi, dan pengalaman belajar
              yang bermakna.
            </p>
            <p>
              Program preschool MEC terdiri dari Nursery, Pre-Kindergarten,
              Kindergarten 1, dan Kindergarten 2, dengan fokus pembelajaran yang
              disesuaikan berdasarkan kebutuhan dan kesiapan anak.
            </p>
          </div>
        </motion.div>

        {/* Programme Levels Box (PDF Page 9 Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 overflow-hidden rounded-3xl bg-primary-deep text-primary-foreground shadow-xl"
        >
          <div className="flex">
            {/* Left Accent Strip matching PDF Page 9 */}
            <div className="hidden w-4 shrink-0 bg-accent sm:block" />

            <div className="flex-1 divide-y divide-primary-foreground/15 p-6 sm:p-8 md:p-12">
              {programmes.map((prog, i) => (
                <motion.article
                  key={prog.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`${i === 0 ? "pb-7" : i === programmes.length - 1 ? "pt-7" : "py-7"}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
                      <ArrowRight className="size-5 stroke-[2.5]" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                        {prog.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-primary-foreground/90 md:text-base">
                        {prog.desc}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
