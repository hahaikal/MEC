"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, BookOpen, Calendar, Baby, LogOut } from "lucide-react";
import { useActiveClasses } from "@/lib/hooks/use-classes";
import { usePrograms } from "@/lib/hooks/use-programs";

export function ParentHubSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname() || "";
  const [openProgram, setOpenProgram] = useState(pathname.includes("/program/"));
  const [openClass, setOpenClass] = useState(pathname.includes("/class/"));
  const { data: programs = [], isLoading: isProgramsLoading } = usePrograms();
  const { data: dynamicClasses = [], isLoading } = useActiveClasses();

  const linkBase =
    "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition";
  const linkIdle = "text-neutral-700 hover:bg-[color:var(--mec-grey)]";
  const linkActive = "bg-[color:var(--mec-blue)] text-white shadow-md";

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sticky top-6 w-72 shrink-0 rounded-3xl bg-white p-5 shadow-[0_8px_40px_-20px_rgba(0,0,0,0.2)]">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div
          className="grid h-9 w-9 place-items-center rounded-xl text-white font-bold"
          style={{ background: "var(--mec-blue)" }}
        >
          M
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900">MEC Parent Hub</p>
          <p className="text-xs text-neutral-500">Navigation</p>
        </div>
      </div>

      <nav className="space-y-1">
        {/* Dashboard */}
        <Link
          href="/parent-hub/dashboard"
          className={`${linkBase} ${
            isActive("/parent-hub/dashboard") ? linkActive : linkIdle
          }`}
        >
          <BookOpen className="h-4 w-4" /> Dashboard
        </Link>

        {/* Program */}
        <button
          onClick={() => setOpenProgram((v) => !v)}
          className={`${linkBase} w-full justify-between ${linkIdle}`}
        >
          <span className="flex items-center gap-3">
            <BookOpen className="h-4 w-4" /> Programs
          </span>
          <ChevronDown className={`h-4 w-4 transition ${openProgram ? "rotate-180" : ""}`} />
        </button>
        {openProgram && (
          <div className="ml-3 space-y-1 border-l-2 border-[color:var(--mec-grey)] pl-3">
            {isProgramsLoading ? (
              <div className="py-2 text-xs text-neutral-500 text-center">Loading programs...</div>
            ) : programs.length === 0 ? (
              <div className="py-2 text-xs text-neutral-500 text-center">No active programs found</div>
            ) : (
              programs.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/parent-hub/dashboard/program/${p.id}`}
                  className={`${linkBase} ${
                    isActive(`/parent-hub/dashboard/program/${p.id}`) ? linkActive : linkIdle
                  }`}
                >
                  {p.name}
                </Link>
              ))
            )}
          </div>
        )}

        {/* Class */}
        <button
          onClick={() => setOpenClass((v) => !v)}
          className={`${linkBase} w-full justify-between ${linkIdle}`}
        >
          <span className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4" /> Classes
          </span>
          <ChevronDown className={`h-4 w-4 transition ${openClass ? "rotate-180" : ""}`} />
        </button>
        {openClass && (
          <div className="ml-3 max-h-64 overflow-y-auto space-y-1 border-l-2 border-[color:var(--mec-grey)] pl-3 pr-1">
            {isLoading ? (
              <div className="py-2 text-xs text-neutral-500 text-center">Loading classes...</div>
            ) : dynamicClasses.length === 0 ? (
              <div className="py-2 text-xs text-neutral-500 text-center">No active classes found</div>
            ) : (
              dynamicClasses.map((c) => (
                <Link
                  key={c.id}
                  href={`/parent-hub/dashboard/class/${c.id}`}
                  className={`${linkBase} ${
                    isActive(`/parent-hub/dashboard/class/${c.id}`) ? linkActive : linkIdle
                  }`}
                >
                  {c.name}
                </Link>
              ))
            )}
          </div>
        )}



        {/* Preschool */}
        <Link
          href="/parent-hub/dashboard/preschool"
          className={`${linkBase} ${
            isActive("/parent-hub/dashboard/preschool") ? linkActive : linkIdle
          }`}
        >
          <Baby className="h-4 w-4" /> MEC Preschool
        </Link>
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-[color:var(--mec-grey)]"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  );
}
