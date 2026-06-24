import { GAL_1, GAL_2, GAL_3, GAL_4, GAL_5, GAL_6 } from "./constants";
import { Blob } from "./blob";

export function Gallery() {
  const items = [
    { src: GAL_1, label: "End Of Year Concert 2025", h: "h-72" },
    { src: GAL_2, label: "Open House 2026", h: "h-96" },
    { src: GAL_3, label: "Halloween 2025", h: "h-80" },
    { src: GAL_4, label: "Field Trip - JCO", h: "h-72" },
    { src: GAL_5, label: "Music Education", h: "h-72" },
    { src: GAL_6, label: "Field Trip - Ichiban Sushi", h: "h-96" },
  ];
  return (
    <section id="gallery" className="relative py-20 md:py-28 overflow-hidden">
      <Blob className="absolute -bottom-32 -left-32 h-96 w-96 opacity-[0.08]" color="primary" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Gallery
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Moments from our classrooms.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Curiosity, laughter, and learning — every day at MEC. Take a peek
            inside our friendly classrooms.
          </p>
        </div>

        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {items.map((it, i) => (
            <div
              key={i}
              className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-card group"
            >
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className={`w-full ${it.h} object-cover transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur rounded-full px-3 py-1 text-xs font-semibold text-foreground shadow-card">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
