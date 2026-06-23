"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ParentHubSidebar } from "@/components/parent-hub/sidebar";
import { BlobBackground } from "@/components/parent-hub/blob-bg";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("parent-hub-auth") !== "1") {
      router.replace("/parent-hub/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem("parent-hub-auth");
    router.push("/parent-hub/login");
  };

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--mec-grey)] text-neutral-500">
        Loading…
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
        <ParentHubSidebar onLogout={logout} />
      </div>
    </div>
  );
}
