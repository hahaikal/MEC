import { Clock, User } from "lucide-react";
import type { ClassSchedule, ClassColor } from "@/data/schedule";

const colorMap: Record<ClassColor, { bg: string; fg: string }> = {
  mint: { bg: "var(--accent-mint)", fg: "var(--accent-mint-foreground)" },
  lavender: { bg: "var(--accent-lavender)", fg: "var(--accent-lavender-foreground)" },
  sky: { bg: "var(--accent-sky)", fg: "var(--accent-sky-foreground)" },
  peach: { bg: "var(--accent-peach)", fg: "var(--accent-peach-foreground)" },
  butter: { bg: "var(--accent-butter)", fg: "var(--accent-butter-foreground)" },
  rose: { bg: "var(--accent-rose)", fg: "var(--accent-rose-foreground)" },
};

function initials(name: string) {
  if (!name || name === "No Teacher") return "NT";
  return name
    .replace(/^(Ms\.|Mr\.|Sir|Mrs\.)\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function ClassCard({ cls }: { cls: ClassSchedule }) {
  const c = colorMap[cls.color] || colorMap.sky; // fallback just in case
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div
        className="px-5 pt-4 pb-5"
        style={{ backgroundColor: c.bg, color: c.fg }}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/50 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {cls.time}
          </span>
          <span className="text-xs font-medium opacity-70">
            {cls.students.length} students
          </span>
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{cls.name}</h3>
        <div className="mt-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-xs font-semibold backdrop-blur-sm"
          >
            {initials(cls.teacher)}
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <User className="h-3.5 w-3.5 opacity-60" />
            {cls.teacher}
          </div>
        </div>
      </div>
      <div className="flex-1 px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Students
        </p>
        <ul className="space-y-1 max-h-[120px] overflow-y-auto pr-2 scrollbar-hide">
          {cls.students.length > 0 ? cls.students.map((student, i) => (
            <li
              key={`${student}-${i}`}
              className="flex items-center gap-2 text-sm text-foreground/90"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: c.bg }}
              />
              {student}
            </li>
          )) : (
            <li className="text-sm text-muted-foreground italic">Belum ada siswa</li>
          )}
        </ul>
      </div>
    </div>
  );
}
