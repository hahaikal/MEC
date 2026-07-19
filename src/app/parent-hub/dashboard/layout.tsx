"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ParentHubSidebar } from "@/components/parent-hub/sidebar";
import { BlobBackground } from "@/components/parent-hub/blob-bg";

const ONE_DAY = 24 * 60 * 60 * 1000;

export interface ParentHubSession {
  type: 'student' | 'staff';
  // Student fields
  studentId?: string;
  studentName?: string;
  photoUrl?: string | null;
  enrollments?: { class_id: string; class_name: string; program_id: string; program_name: string }[];
  classNames?: string;
  // Staff fields
  userId?: string;
  userName?: string;
  roles?: string[];
  // Common
  loginAt: string;
}

function getSession(): ParentHubSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("parent-hub-session");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isSessionExpired(session: ParentHubSession): boolean {
  const loginAt = new Date(session.loginAt).getTime();
  const lastActive = parseInt(sessionStorage.getItem("parent-hub-last-active") || "0", 10);
  const referenceTime = Math.max(loginAt, lastActive);
  return Date.now() - referenceTime > ONE_DAY;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<ParentHubSession | null>(null);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem("parent-hub-session");
    sessionStorage.removeItem("parent-hub-auth");
    sessionStorage.removeItem("parent-hub-last-active");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentSession = getSession();

    // No session at all
    if (!currentSession) {
      // Check legacy auth
      if (sessionStorage.getItem("parent-hub-auth") === "1") {
        // Legacy session without proper data — clear and redirect
        clearSession();
      }
      router.replace("/parent-hub/login");
      return;
    }

    // Session expired (1 day inactivity)
    if (isSessionExpired(currentSession)) {
      clearSession();
      router.replace("/parent-hub/login");
      return;
    }

    // Update last active time
    sessionStorage.setItem("parent-hub-last-active", Date.now().toString());
    setSession(currentSession);
    setReady(true);
  }, [router, clearSession]);

  // Update last active on any user interaction
  useEffect(() => {
    if (!ready) return;

    const updateActivity = () => {
      sessionStorage.setItem("parent-hub-last-active", Date.now().toString());
    };

    // Throttle: update at most every 60 seconds
    let lastUpdate = Date.now();
    const throttledUpdate = () => {
      if (Date.now() - lastUpdate > 60_000) {
        updateActivity();
        lastUpdate = Date.now();
      }
    };

    window.addEventListener("click", throttledUpdate);
    window.addEventListener("keydown", throttledUpdate);
    window.addEventListener("scroll", throttledUpdate);

    return () => {
      window.removeEventListener("click", throttledUpdate);
      window.removeEventListener("keydown", throttledUpdate);
      window.removeEventListener("scroll", throttledUpdate);
    };
  }, [ready]);

  const logout = () => {
    clearSession();
    router.push("/parent-hub/login");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--mec-grey)] text-neutral-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-300 border-t-[color:var(--mec-blue)]" />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[color:var(--mec-grey)]">
      <BlobBackground />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <main className="min-w-0 flex-1 space-y-6">
          {children}
        </main>
        <ParentHubSidebar onLogout={logout} session={session} />
      </div>
    </div>
  );
}
