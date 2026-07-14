import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  tone: "mint" | "lavender" | "sky" | "peach";
}

const toneStyles: Record<StatCardProps["tone"], { bg: string; fg: string }> = {
  mint: { bg: "var(--accent-mint)", fg: "var(--accent-mint-foreground)" },
  lavender: { bg: "var(--accent-lavender)", fg: "var(--accent-lavender-foreground)" },
  sky: { bg: "var(--accent-sky)", fg: "var(--accent-sky-foreground)" },
  peach: { bg: "var(--accent-peach)", fg: "var(--accent-peach-foreground)" },
};

export function StatCard({ label, value, icon: Icon, hint, tone }: StatCardProps) {
  const s = toneStyles[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: s.bg, color: s.fg }}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
      </div>
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ backgroundColor: s.bg }}
      />
    </div>
  );
}
