import type { Status } from "@/lib/parent-hub-data";

const LABEL: Record<Status, string> = {
  past: "Completed",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

export function StatusPill({ status }: { status: Status }) {
  const style: Record<Status, string> = {
    past: "bg-[color:var(--mec-grey)] text-neutral-700",
    ongoing: "bg-[color:var(--mec-yellow)] text-neutral-900",
    upcoming: "bg-[color:var(--mec-blue)] text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
