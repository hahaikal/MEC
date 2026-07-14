"use client";

import Image from "next/image";
import { useState } from "react";
import { StatusPill } from "./status-pill";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tag, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface GalleryItemData {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  is_active: boolean;
  event_date?: string | null;
  created_at: string;
  classes?: {
    name: string;
    programs?: {
      name: string;
    };
  };
}

function getEventStatus(eventDateStr: string | null | undefined): "upcoming" | "ongoing" | "past" | null {
  if (!eventDateStr) return null;
  const eventDate = new Date(eventDateStr);
  eventDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (eventDate > today) return "upcoming";
  if (eventDate < today) return "past";
  return "ongoing";
}

export function GalleryGrid({ items }: { items: GalleryItemData[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-sm border border-neutral-100">
        <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-neutral-500 text-sm">No activities in this category yet.</p>
      </div>
    );
  }

  // Parse comma-separated images
  const getImages = (urlStr: string) => urlStr.split(',').map(u => u.trim()).filter(Boolean);

  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const images = getImages(item.image_url);
          const firstImage = images[0] || '';

          return (
            <article
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white cursor-pointer border border-neutral-100 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(29,117,192,0.25)] h-[420px]"
            >
              <div className="w-full shrink-0 overflow-hidden relative h-56 bg-neutral-100">
                <Image
                  src={firstImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg border border-white/20">
                    1/{images.length}
                  </div>
                )}
                {item.classes?.programs?.name && (
                  <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-mec-blue backdrop-blur-md shadow-sm">
                    {item.classes.programs.name}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-3 p-6 flex-1 bg-gradient-to-b from-transparent to-neutral-50/50">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.event_date || item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {item.category === "event" && item.event_date && (
                    <StatusPill status={getEventStatus(item.event_date) || "ongoing"} />
                  )}
                  {item.classes?.name && !item.event_date && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-mec-blue bg-blue-50 px-2.5 py-1 rounded-full">
                      <Tag className="h-3.5 w-3.5" />
                      {item.classes.name}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 line-clamp-2 leading-tight group-hover:text-mec-blue transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl">
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Image Section */}
              <div className="w-full md:w-3/5 bg-black/5 relative flex items-center justify-center p-4">
                {(() => {
                  const images = getImages(selectedItem.image_url);
                  return (
                    <Carousel className="w-full max-w-2xl mx-auto">
                      <CarouselContent>
                        {images.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm">
                              <Image 
                                src={img} 
                                alt={`${selectedItem.title} - Image ${idx + 1}`} 
                                fill
                                className="object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {images.length > 1 && (
                        <>
                          <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-black border-none shadow-md backdrop-blur-sm h-10 w-10" />
                          <CarouselNext className="right-4 bg-white/80 hover:bg-white text-black border-none shadow-md backdrop-blur-sm h-10 w-10" />
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
                            Geser untuk melihat foto lain
                          </div>
                        </>
                      )}
                    </Carousel>
                  );
                })()}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-2/5 flex flex-col bg-white">
                <ScrollArea className="h-full flex-1">
                  <div className="p-8">
                    <DialogHeader className="text-left space-y-4 mb-6">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedItem.event_date || selectedItem.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        {selectedItem.classes?.name && (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-mec-blue bg-blue-50 px-3 py-1.5 rounded-full">
                            <Tag className="h-4 w-4" />
                            {selectedItem.classes.name}
                          </span>
                        )}
                        {selectedItem.classes?.programs?.name && (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-mec-blue px-3 py-1.5 rounded-full">
                            {selectedItem.classes.programs.name}
                          </span>
                        )}
                      </div>
                      <DialogTitle className="text-3xl font-display font-bold text-neutral-900 leading-tight">
                        {selectedItem.title}
                      </DialogTitle>
                    </DialogHeader>

                    {selectedItem.description && (
                      <div className="prose prose-neutral prose-sm max-w-none">
                        <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed text-base">
                          {selectedItem.description}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
