"use client";

import { PlayCircle, Image as ImageIcon, Calendar, Tag, ChevronRight, Clock, Filter } from "lucide-react";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { useAllClassActivities } from "@/lib/hooks/use-activities";
import { usePrograms } from "@/lib/hooks/use-programs";
import { useActiveClasses } from "@/lib/hooks/use-classes";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

// Parse comma-separated images
const getImages = (urlStr: string) => (urlStr || "").split(',').map(u => u.trim()).filter(Boolean);

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

export default function GalleryMediaPage() {
  const { t } = useLanguage();
  const { data: events, isLoading: isEventsLoading } = useActiveGalleryItems("event");
  const { data: activities, isLoading: isActivitiesLoading } = useAllClassActivities(50);
  const { data: programs = [] } = usePrograms();
  const { data: dynamicClasses = [] } = useActiveClasses();
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("all");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("parent-hub-session");
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const isLoading = isEventsLoading || isActivitiesLoading;

  // Reset class selection when program changes
  useEffect(() => {
    setSelectedClassId("all");
  }, [selectedProgramId]);

  const filteredDropdownClasses = selectedProgramId !== "all"
    ? dynamicClasses.filter((c: any) => c.program_id === selectedProgramId)
    : dynamicClasses;

  const rawMediaItems: any[] = [];
  
  const featuredEvent = events && events.length > 0 ? events[0] : null;
  if (featuredEvent) {
    rawMediaItems.push({
      ...featuredEvent,
      id: featuredEvent.id,
      type: "gallery",
      title: featuredEvent.title,
      snippet: featuredEvent.description || "Special event highlight from our school.",
      date: featuredEvent.event_date 
        ? format(new Date(featuredEvent.event_date), 'MMMM d, yyyy') 
        : format(new Date(featuredEvent.created_at), 'MMMM d, yyyy'),
      rawDate: featuredEvent.event_date || featuredEvent.created_at,
      thumbnail: getImages(featuredEvent.image_url)[0] || "https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1200",
      tag: t("gallery.specialEvent"),
      original: featuredEvent
    });
  }

  if (activities) {
    activities.forEach((act: any) => {
      rawMediaItems.push({
        ...act,
        id: act.id,
        type: "gallery",
        title: act.title,
        snippet: act.description || (act.classes?.name ? `Activity from ${act.classes.name}` : "Class activity highlight."),
        date: format(new Date(act.created_at), 'MMMM d, yyyy'),
        rawDate: act.created_at,
        thumbnail: getImages(act.image_url)[0] || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200",
        tag: act.classes?.programs?.name || act.category || t("gallery.classActivity"),
        original: act
      });
    });
  }

  const isStaff = session?.type === 'staff';
  const enrolledProgramIds = session?.enrollments?.map((e: any) => e.program_id) || [];

  // Filter the final items based on selection
  const mediaItems = rawMediaItems.filter((item) => {
    const isEvent = item.original.category === 'event';
    const itemProgId = item.original.classes?.program_id || item.original.category;
    const itemClassId = item.original.class_id;

    // Student filter logic
    if (!isStaff) {
      if (!isEvent && !enrolledProgramIds.includes(itemProgId)) return false;
    }

    // Interactive UI Filter logic (only for staff, but logic applies)
    if (isEvent) {
      return selectedProgramId === "all" && selectedClassId === "all";
    }

    if (selectedProgramId !== "all" && itemProgId !== selectedProgramId) return false;
    if (selectedClassId !== "all" && itemClassId !== selectedClassId) return false;

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-[#111111]">{t("gallery.title")}</h1>
          <p className="mt-2 text-lg text-neutral-600">{t("gallery.subtitle")}</p>
        </div>
      </div>

      {/* Filters (Only for Staff) */}
      {isStaff && (
        <div className="flex justify-end">
          <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center gap-2 px-2 text-neutral-500">
              <Filter className="h-4 w-4" />
            </div>
            <select 
              value={selectedProgramId} 
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="bg-[#F2F2F2] border-none text-sm font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-mec-blue/20"
            >
              <option value="all">{t("gallery.allPrograms")}</option>
              {programs.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={selectedProgramId === "all" && filteredDropdownClasses.length === 0}
              className="bg-[#F2F2F2] border-none text-sm font-medium rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-mec-blue/20 disabled:opacity-50"
            >
              <option value="all">{t("gallery.allClasses")}</option>
              {filteredDropdownClasses.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-8 lg:grid-cols-2">
           <div className="h-96 w-full animate-pulse rounded-3xl bg-white/60 shadow-card lg:col-span-2"></div>
           <div className="h-64 w-full animate-pulse rounded-3xl bg-white/60 shadow-card"></div>
           <div className="h-64 w-full animate-pulse rounded-3xl bg-white/60 shadow-card"></div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-card border border-neutral-100">
          <ImageIcon className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
          <h3 className="font-display text-xl font-bold text-[#111111]">{t("gallery.noMedia")}</h3>
          <p className="text-neutral-500">{t("gallery.checkBack")}</p>
        </div>
      ) : (
        /* Feed Layout */
        <div className="grid gap-8 lg:grid-cols-2">
          {mediaItems.map((item, idx) => (
            <article 
              key={`${item.id}-${idx}`} 
              onClick={() => setSelectedItem(item.original)}
              className={`group cursor-pointer relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-neutral-50 ${
                idx === 0 && selectedProgramId === "all" && selectedClassId === "all" ? "lg:col-span-2 lg:flex-row" : ""
              }`}
            >
              {/* Thumbnail */}
              <div className={`relative overflow-hidden bg-neutral-100 ${idx === 0 && selectedProgramId === "all" && selectedClassId === "all" ? "lg:w-3/5" : "w-full aspect-[4/3] sm:aspect-video"}`}>
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                
                {/* Overlay Icon */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                  <ImageIcon className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>

                {/* Tag overlay on image */}
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mec-yellow px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mec-ink shadow-md">
                    <Tag className="h-3 w-3" /> {item.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-1 flex-col justify-between p-6 md:p-8 ${idx === 0 && selectedProgramId === "all" && selectedClassId === "all" ? "lg:w-2/5 lg:justify-center" : ""}`}>
                <div>
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-mec-blue">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </div>
                  <h3 className={`font-display font-extrabold text-[#111111] line-clamp-2 ${idx === 0 && selectedProgramId === "all" && selectedClassId === "all" ? "text-3xl leading-tight" : "text-2xl"}`}>
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-neutral-600 line-clamp-3">
                    {item.snippet}
                  </p>
                </div>
                
                <div className="mt-6">
                  <button className="group/btn inline-flex items-center gap-2 font-bold text-mec-blue transition-colors hover:text-blue-800">
                    {t("gallery.viewGallery")}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Interactive Dialog */}
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
                            {new Date(selectedItem.event_date || selectedItem.created_at).toLocaleDateString(t("gallery.viewGallery") === "Lihat Galeri" ? "id-ID" : "en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          
                          {selectedItem.event_date && selectedItem.category === "event" && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full">
                              <Clock className="h-4 w-4" />
                              {new Date(selectedItem.event_date).toLocaleTimeString(t("gallery.viewGallery") === "Lihat Galeri" ? "id-ID" : "en-US", {
                                hour: "numeric", minute: "2-digit"
                              })}
                            </span>
                          )}

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
    </div>
  );
}
