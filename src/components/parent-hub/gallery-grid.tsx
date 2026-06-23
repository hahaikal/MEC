import type { GalleryItem } from "@/lib/parent-hub-data";
import { StatusPill } from "./status-pill";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid gap-6 grid-cols-1">
      {items.map((item) => (
        <article
          key={item.id}
          className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-15px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(29,117,192,0.25)]"
        >
          <div className="md:w-2/5 shrink-0 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center space-y-3 p-6 md:p-8 flex-1">
            <div className="flex items-center justify-between">
              <StatusPill status={item.status} />
              <span className="text-sm font-medium text-neutral-500">{item.date}</span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">{item.title}</h3>
            <p className="text-base text-neutral-600 max-w-2xl">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
