import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, PlayCircle, CheckCircle2, Tag } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";
import {
  Dialog,
  DialogContent,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GalleryItem } from "@/types/gallery";

type EventStatus = "ongoing" | "upcoming" | "completed";

const statusMeta: Record<
  EventStatus,
  { label: string; chip: string; accent: string; icon: typeof Calendar; dot: string }
> = {
  ongoing: {
    label: "Ongoing",
    chip: "bg-mec-yellow text-mec-ink",
    accent: "from-mec-yellow/60 to-mec-yellow/0",
    icon: PlayCircle,
    dot: "bg-mec-yellow",
  },
  upcoming: {
    label: "Upcoming",
    chip: "bg-mec-blue text-white",
    accent: "from-mec-blue/30 to-mec-blue/0",
    icon: Calendar,
    dot: "bg-mec-blue",
  },
  completed: {
    label: "Completed",
    chip: "bg-muted text-muted-foreground",
    accent: "from-muted to-transparent",
    icon: CheckCircle2,
    dot: "bg-muted-foreground/50",
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "TBA";
  const dt = new Date(iso);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(iso: string | null) {
  if (!iso) return "All Day";
  const dt = new Date(iso);
  return dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getEventStatus(item: GalleryItem): EventStatus {
  if (!item.event_date) return "ongoing";
  const d = new Date(item.event_date).setHours(0,0,0,0);
  const today = new Date().setHours(0,0,0,0);
  if (d > today) return "upcoming";
  if (d < today) return "completed";
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

function EventCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const status = getEventStatus(item);
  const meta = statusMeta[status];
  return (
    <article 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card p-4 shadow-float transition hover:-translate-y-0.5 hover:shadow-pop flex-1"
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${meta.accent} opacity-70`} />
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-mec-blue-soft overflow-hidden">
          {item.image_url ? (
            <img src={item.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-2xl">🗓️</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}>
              <meta.icon className="h-3 w-3" />
              {meta.label}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">{item.category}</span>
          </div>
          <h4 className="mt-1.5 truncate font-display text-base font-bold text-foreground">
            {item.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          <div className="mt-2.5 flex items-center gap-3 text-[11px] font-semibold text-foreground/70">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(item.event_date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTime(item.event_date)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Column({ status, items, onSelect }: { status: EventStatus; items: GalleryItem[]; onSelect: (item: GalleryItem) => void }) {
  const meta = statusMeta[status];
  let columnItems = items.filter(it => getEventStatus(it) === status);

  if (status === 'upcoming') {
    columnItems.sort((a, b) => new Date(a.event_date || 0).getTime() - new Date(b.event_date || 0).getTime());
  } else if (status === 'completed') {
    columnItems.sort((a, b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime());
  }

  columnItems = columnItems.slice(0, 5);
  
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-3xl bg-white/60 p-4 shadow-float backdrop-blur h-full">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h3 className="font-display text-lg font-bold text-foreground">{meta.label}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
            {columnItems.length}
          </span>
        </div>
      </header>
      <div className="flex flex-col gap-3">
        {columnItems.length === 0 ? (
          <p className="rounded-2xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">
            No {meta.label.toLowerCase()} events.
          </p>
        ) : (
          columnItems.map((it) => <EventCard key={it.id} item={it} onClick={() => onSelect(it)} />)
        )}
      </div>
    </div>
  );
}

export function EventColumns({ items }: { items: GalleryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Parse comma-separated images
  const getImages = (urlStr?: string | null) => urlStr ? urlStr.split(',').map(u => u.trim()).filter(Boolean) : [];

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Event Status</h2>
          <p className="text-sm text-muted-foreground">A quick look at what's happening this month.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Column status="ongoing" items={items} onSelect={setSelectedItem} />
        <Column status="upcoming" items={items} onSelect={setSelectedItem} />
        <Column status="completed" items={items} onSelect={setSelectedItem} />
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
                        {images.length > 0 ? images.map((img, idx) => (
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
                        )) : (
                          <CarouselItem>
                            <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm bg-neutral-100 flex items-center justify-center text-4xl">
                              🗓️
                            </div>
                          </CarouselItem>
                        )}
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
                          {(selectedItem as any).classes?.name && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-mec-blue bg-blue-50 px-3 py-1.5 rounded-full">
                              <Tag className="h-4 w-4" />
                              {(selectedItem as any).classes.name}
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
    </section>
  );
}
