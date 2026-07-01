"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, BookOpen, Calendar, Baby, LogOut, Menu, X } from "lucide-react";
import { useActiveClasses } from "@/lib/hooks/use-classes";
import { usePrograms } from "@/lib/hooks/use-programs";

export function ParentHubSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname() || "";
  const [openProgram, setOpenProgram] = useState(pathname.includes("/program/"));
  const [openClass, setOpenClass] = useState(pathname.includes("/class/"));
  const [isOpen, setIsOpen] = useState(false);
  const { data: programs = [], isLoading: isProgramsLoading } = usePrograms();
  const { data: dynamicClasses = [], isLoading } = useActiveClasses();

  const linkBase =
    "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition";
  const linkIdle = "text-neutral-700 hover:bg-[color:var(--mec-grey)]";
  const linkActive = "bg-[color:var(--mec-blue)] text-white shadow-md";

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white rounded-lg p-2 shadow-md border text-neutral-600 hover:text-neutral-900"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-screen w-72 shrink-0 bg-white p-5 shadow-2xl z-40 transition-transform duration-300 overflow-y-auto lg:sticky lg:top-6 lg:h-auto lg:rounded-3xl lg:shadow-[0_8px_40px_-20px_rgba(0,0,0,0.2)] lg:translate-x-0 lg:overflow-visible ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
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
    </>
  );
}
