"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Star4, DotsGrid, Cloud } from "./Doodles";

const approaches = [
  {
    title: "Play-Based Learning",
    desc: "Children learn best when they are actively engaged. Through play-based learning, children explore ideas, develop skills, solve problems, and build confidence through meaningful experiences.",
    descId:
      "Anak belajar secara optimal ketika mereka terlibat aktif. Melalui kegiatan bermain yang bermakna, anak dapat mengeksplorasi ide, mengembangkan keterampilan, memecahkan masalah, dan membangun kepercayaan diri.",
  },
  {
    title: "Holistic Development",
    desc: "We nurture the whole child by supporting language, cognitive, physical, social-emotional, and character development.",
    descId:
      "Kami mendukung perkembangan anak secara menyeluruh melalui stimulasi kemampuan bahasa, kognitif, fisik, sosial emosional, serta pembentukan karakter.",
  },
  {
    title: "Child-Centred Learning",
    desc: "Our learning experiences are designed based on children’s interests, needs, and developmental stages.",
    descId:
      "Pengalaman belajar dirancang berdasarkan minat, kebutuhan, dan tahap perkembangan setiap anak.",
  },
  {
    title: "Hands-On & Experiential Learning",
    desc: "Children learn through exploration, experiments, projects, and real-life experiences that make learning meaningful.",
    descId:
      "Anak belajar melalui kegiatan eksplorasi, eksperimen, proyek, dan pengalaman nyata yang membuat proses belajar lebih bermakna.",
  },
];

export function CurriculumApproach() {
  return (
    <section
      id="curriculum"
      className="relative overflow-hidden bg-background py-20 md:py-28"
      aria-labelledby="curriculum-title"
    >
      <Cloud className="absolute right-10 top-12 w-16 text-primary/30" />
      <DotsGrid className="absolute left-8 bottom-16 w-14 text-accent/60" />
      <Star4 className="absolute left-12 top-16 w-7 text-accent" />

      <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Curriculum &amp; Approach
          </span>
          <h2
            id="curriculum-title"
            className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl"
          >
            Curriculum &amp; <span className="text-primary">Learning Approach</span>
          </h2>
        </div>

        {/* Page 7 Content: Photo + Curriculum Description */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-12">
          {/* Photo Place (PDF Page 7 Left Side) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative lg:col-span-5"
          >
            <div className="relative flex overflow-hidden rounded-3xl bg-white shadow-xl border border-border/60">
              {/* Accent vertical bar matching PDF design */}
              <div className="w-4 shrink-0 bg-accent" />
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src="/images/preschool4.jpeg"
                  alt="MEC Preschool students learning together with books and learning materials"
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <Star4 className="absolute -right-4 -top-4 w-8 text-primary" />
          </motion.div>

          {/* Text Content (PDF Page 7 Right & Bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 lg:col-span-7"
          >
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Curriculum &amp; Learning Approach
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
                At MEC Preschool, we believe that early childhood education should
                provide meaningful learning experiences that support every child’s
                holistic development. Our programme combines the Indonesian{" "}
                <span className="font-semibold text-primary">Kurikulum Merdeka</span>{" "}
                with an{" "}
                <span className="font-semibold text-primary">
                  Early Years Development Programme (EYDP)
                </span>{" "}
                approach, enriched by carefully selected local and international
                learning resources.
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
                This approach allows us to create a balanced learning experience
                that supports children’s cognitive, language, physical,
                social-emotional, and character development while encouraging
                curiosity, creativity, confidence, and independence.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/60 p-5 space-y-3 text-sm italic leading-relaxed text-muted-foreground">
              <p>
                Di MEC Preschool, kami percaya bahwa pendidikan anak usia dini
                harus memberikan pengalaman belajar yang bermakna dan mendukung
                perkembangan anak secara menyeluruh. Program kami menggabungkan
                Kurikulum Merdeka dengan pendekatan Early Years Development
                Programme (EYDP), yang diperkaya dengan berbagai sumber belajar
                lokal dan internasional yang dipilih secara cermat.
              </p>
              <p>
                Pendekatan ini membantu kami menciptakan pengalaman belajar yang
                seimbang untuk mendukung perkembangan kognitif, bahasa, fisik,
                sosial emosional, serta pembentukan karakter anak, sekaligus
                menumbuhkan rasa ingin tahu, kreativitas, kepercayaan diri, dan
                kemandirian.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Page 8 Content: Learning Approach 4 Pillars */}
        <div className="mt-20">
          <div className="mb-10 text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Learning <span className="text-primary">Approach</span>
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {approaches.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
                    <ArrowRight className="size-5 stroke-[2.5]" />
                  </span>
                  <h4 className="font-display text-xl font-bold text-foreground">
                    {item.title}
                  </h4>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90 md:text-base">
                  {item.desc}
                </p>
                <p className="mt-3 border-t border-border/50 pt-3 text-xs italic leading-relaxed text-muted-foreground md:text-sm">
                  {item.descId}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
