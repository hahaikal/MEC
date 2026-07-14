'use client'

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

function getGreeting(hour: number) {
  if (hour < 12) return "Selamat Pagi";
  if (hour < 18) return "Selamat Siang";
  return "Selamat Malam";
}

export function Greeting({ name = "Admin" }: { name?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : "Selamat Datang";
  const dateStr = now
    ? now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {dateStr || "Memuat..."}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {greeting}, {name} 👋
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Berikut adalah ringkasan hari ini: jadwal kelas, penugasan guru, 
          dan operasional My English Course.
        </p>
      </div>
    </div>
  );
}
