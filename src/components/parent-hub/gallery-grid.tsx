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

function LinkifiedText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-mec-blue hover:underline font-medium break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
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
      <div className="flex flex-col gap-8">
        {items.map((item) => {
          const images = getImages(item.image_url);
          const firstImage = images[0] || '';
          
          const badgeText = item.classes?.programs?.name || item.classes?.name || (item.category === "event" ? "SPECIAL EVENT" : "GALLERY");

          return (
            <article
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group flex flex-col sm:flex-row overflow-hidden rounded-[2rem] bg-white cursor-pointer shadow-sm border border-neutral-100 hover:shadow-md transition-all duration-300 relative h-auto sm:h-56"
            >
              {/* Left Side: Image */}
              <div className="relative w-full sm:w-2/5 md:w-1/3 shrink-0 aspect-[16/9] sm:aspect-auto h-48 sm:h-full bg-neutral-100 overflow-hidden">
                <Image
                  src={firstImage}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Right Side: Content */}
              <div className="flex flex-col p-6 sm:p-8 flex-1 justify-center min-w-0">
                <div className="mb-2 text-sm text-neutral-500 font-medium">
                  {new Date(item.event_date || item.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </div>
                
                <h3 className="text-2xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-mec-blue transition-colors">
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-neutral-600 line-clamp-2 leading-relaxed">
                    <LinkifiedText text={item.description} />
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
            <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
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
                        </>
                      )}
                    </Carousel>
                  );
                })()}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-2/5 flex-1 min-h-0 md:relative">
                <div className="md:absolute md:inset-0 flex flex-col bg-white h-full">
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
                      <div className="prose prose-neutral prose-sm w-full max-w-full overflow-hidden">
                        <p 
                          className="text-neutral-700 whitespace-pre-wrap leading-relaxed text-base"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          <LinkifiedText text={selectedItem.description} />
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
