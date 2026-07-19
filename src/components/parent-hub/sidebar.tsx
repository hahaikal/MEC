"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, BookOpen, Baby, LogOut, Menu, X, User } from "lucide-react";
import { useActiveClasses } from "@/lib/hooks/use-classes";
import { usePrograms } from "@/lib/hooks/use-programs";

interface SessionData {
  type: 'student' | 'staff';
  studentId?: string;
  studentName?: string;
  photoUrl?: string | null;
  enrollments?: { class_id: string; class_name: string; program_id: string; program_name: string }[];
  classNames?: string;
  userId?: string;
  userName?: string;
  roles?: string[];
  loginAt: string;
}

export function ParentHubSidebar({ onLogout, session }: { onLogout: () => void; session?: SessionData | null }) {
  const pathname = usePathname() || "";
  const [openProgram, setOpenProgram] = useState(pathname.includes("/program/"));
  const [openClass, setOpenClass] = useState(pathname.includes("/class/"));
  const [isOpen, setIsOpen] = useState(false);
  const { data: programs = [], isLoading: isProgramsLoading } = usePrograms();
  const { data: dynamicClasses = [], isLoading } = useActiveClasses();

  const isStaff = session?.type === 'staff';
  const displayName = isStaff ? (session?.userName || 'Staff') : (session?.studentName || 'Student');
  const displayPhoto = session?.photoUrl;
  const displayClass = isStaff ? 'Full Access' : (session?.classNames || '');

  // Filter programs and classes based on student enrollment
  const enrolledClassIds = session?.enrollments?.map(e => e.class_id) || [];
  const enrolledProgramIds = [...new Set(session?.enrollments?.map(e => e.program_id) || [])];

  const filteredPrograms = isStaff
    ? programs
    : programs.filter((p: any) => enrolledProgramIds.includes(p.id));

  const filteredClasses = isStaff
    ? dynamicClasses
    : dynamicClasses.filter((c: any) => enrolledClassIds.includes(c.id));

  // Check if student is enrolled in preschool
  const hasPreschoolAccess = isStaff || (session?.enrollments || []).some(
    e => e.program_name?.toLowerCase().includes('preschool')
  );

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
      {/* Profile Section */}
      <div className="mb-5 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[color:var(--mec-blue)]/5 to-[color:var(--mec-yellow)]/5 border border-neutral-100">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[color:var(--mec-blue)]/30 bg-neutral-100">
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm font-bold text-white"
              style={{ background: "var(--mec-blue)" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-neutral-900 truncate">{displayName}</p>
          <p className="text-xs text-neutral-500 truncate">
            {isStaff ? (
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Staff Access
              </span>
            ) : (
              displayClass || 'Student'
            )}
          </p>
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

        {/* Programs */}
        {(isStaff || filteredPrograms.length > 0) && (
          <>
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
                ) : filteredPrograms.length === 0 ? (
                  <div className="py-2 text-xs text-neutral-500 text-center">No programs available</div>
                ) : (
                  filteredPrograms.map((p: any) => (
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
          </>
        )}

        {/* Classes */}
        {(isStaff || filteredClasses.length > 0) && (
          <>
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
                ) : filteredClasses.length === 0 ? (
                  <div className="py-2 text-xs text-neutral-500 text-center">No classes available</div>
                ) : (
                  filteredClasses.map((c: any) => (
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
          </>
        )}

        {/* Preschool - only if enrolled or staff */}
        {hasPreschoolAccess && (
          <Link
            href="/parent-hub/dashboard/preschool"
            className={`${linkBase} ${
              isActive("/parent-hub/dashboard/preschool") ? linkActive : linkIdle
            }`}
          >
            <Baby className="h-4 w-4" /> MEC Preschool
          </Link>
        )}
      </nav>

      <button
        onClick={onLogout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-red-50 hover:text-red-600 hover:border-red-200"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
    </>
  );
}
