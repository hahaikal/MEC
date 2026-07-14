import { CalendarDays } from "lucide-react";
import type { ScheduleGroup } from "@/data/schedule";
import { ClassCard } from "./ClassCard";

export function ScheduleSection({ group }: { group: ScheduleGroup }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {group.title}
          </h2>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {group.days}
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {group.classes.length} kelas
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {group.classes.map((cls, i) => (
          <ClassCard key={`${cls.name}-${i}`} cls={cls} />
        ))}
      </div>
    </section>
  );
}
