"use client";

import { motion } from "framer-motion";
import { Star4, DotsGrid, Cloud } from "./Doodles";

interface ActivityItem {
  title: string;
  desc: string;
  img?: string;
  alt: string;
  collage?: { src: string; alt: string }[];
}

const activities: ActivityItem[] = [
  {
    title: "Monthly Mini Class",
    desc: "Every month, children participate in a special mini class with different themes and concepts. These activities provide opportunities for children to explore new interests, develop creativity, and experience learning through fun and meaningful activities.",
    img: "/images/preschool5.jpeg",
    alt: "MEC Preschool children participating in a Monthly Mini Class activity",
  },
  {
    title: "Field Trip",
    desc: "Field trips provide children with opportunities to learn beyond the classroom through real-life experiences, exploration, and interaction with the surrounding environment.",
    img: "/images/placeholder-11.png",
    alt: "MEC Preschool students on a sushi-making Field Trip",
  },
  {
    title: "End-of-Year Concert",
    desc: "Held every December, the End-of-Year Concert is a special moment where children showcase their confidence, creativity, and learning progress through performances and presentations.",
    img: "/images/placeholder-5.JPG",
    alt: "MEC Preschool students performing on stage at the End-of-Year Concert",
  },
  {
    title: "Health & Enrichment Activities",
    desc: "MEC Preschool also organizes various supporting activities such as dental check-ups, special learning experiences, and other educational programmes that support children’s overall well-being and development.",
    alt: "MEC Preschool Health and Enrichment Activities",
    collage: [
      {
        src: "/images/preschool10.png",
        alt: "MEC Preschool enrichment and healthy meal activity",
      },
      {
        src: "/images/preschool8.jpeg",
        alt: "MEC Preschool outdoor sensory and enrichment activity",
      },
      {
        src: "/images/preschool6.jpeg",
        alt: "MEC Preschool group enrichment activity",
      },
    ],
  },
];

export function LearningActivities() {
  return (
    <section
      id="activities"
      className="relative overflow-hidden bg-[#f8f9fa] py-20 md:py-28"
      aria-labelledby="activities-title"
    >
      <Cloud className="absolute right-10 top-14 w-16 text-primary/30" />
      <Star4 className="absolute left-10 top-16 w-7 text-accent" />
      <DotsGrid className="absolute right-8 bottom-12 w-14 text-accent/70" />

      <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground">
            Beyond the Classroom
          </span>
          <h2
            id="activities-title"
            className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl"
          >
            Learning Activities &amp;{" "}
            <span className="text-primary">School Events</span>
          </h2>
        </div>

        {/* Activity Rows (Matching PDF Page 10 Layout) */}
        <div className="mt-14 space-y-8">
          {activities.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="overflow-hidden rounded-3xl border border-border/60 bg-background shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="grid items-center md:grid-cols-12">
                {/* Left Photo Place with Dual Accent Bars (PDF Page 10 Style) */}
                <div className="flex h-full md:col-span-5">
                  <div className="w-3 shrink-0 bg-accent sm:w-4" />
                  <div className="w-3 shrink-0 bg-primary-deep sm:w-4" />

                  <div className="relative flex-1 overflow-hidden bg-muted">
                    {item.collage ? (
                      <div className="grid aspect-[4/3] w-full grid-cols-2 grid-rows-2 gap-1 bg-white p-1">
                        <div className="col-span-2 row-span-1 overflow-hidden">
                          <img
                            src={item.collage[0].src}
                            alt={item.collage[0].alt}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="col-span-1 row-span-1 overflow-hidden">
                          <img
                            src={item.collage[1].src}
                            alt={item.collage[1].alt}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="col-span-1 row-span-1 overflow-hidden">
                          <img
                            src={item.collage[2].src}
                            alt={item.collage[2].alt}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.alt}
                          width={800}
                          height={600}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Text Content */}
                <div className="p-6 sm:p-8 md:col-span-7 md:p-10">
                  <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
