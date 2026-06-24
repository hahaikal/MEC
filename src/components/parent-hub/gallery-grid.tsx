"use client";

import Image from "next/image";
import { StatusPill } from "./status-pill";

interface GalleryItemData {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export function GalleryGrid({ items }: { items: GalleryItemData[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-sm">
        <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-neutral-500 text-sm">No activities in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1">
      {items.map((item) => (
        <article
          key={item.id}
          className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-15px_rgba(0,0,0,0.15)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(29,117,192,0.25)]"
        >
          <div className="md:w-2/5 shrink-0 overflow-hidden relative aspect-[4/3] md:aspect-auto">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center space-y-3 p-6 md:p-8 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-500">
                {new Date(item.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">{item.title}</h3>
            {item.description && (
              <p className="text-base text-neutral-600 max-w-2xl">{item.description}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
