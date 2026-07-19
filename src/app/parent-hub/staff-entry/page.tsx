"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAsStaff } from "@/actions/parent-hub-auth";
import { Loader2 } from "lucide-react";

export default function StaffEntryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authenticate() {
      try {
        const result = await loginAsStaff();
        if (result.error) {
          setError(result.error);
          return;
        }

        if (result.session) {
          sessionStorage.setItem("parent-hub-session", JSON.stringify(result.session));
          sessionStorage.setItem("parent-hub-auth", "1");
          sessionStorage.setItem("parent-hub-last-active", Date.now().toString());
          router.replace("/parent-hub/dashboard");
        }
      } catch (err) {
        console.error("Staff login error:", err);
        setError("Terjadi kesalahan saat masuk sebagai staff.");
      }
    }

    authenticate();
  }, [router]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--mec-grey)] text-neutral-900">
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg border border-neutral-100 max-w-sm w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/login")}
            className="w-full rounded-xl bg-[color:var(--mec-blue)] py-3 font-medium text-white transition hover:brightness-110"
          >
            Kembali ke Login Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[color:var(--mec-grey)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[color:var(--mec-blue)]" />
        <p className="font-medium text-neutral-600 animate-pulse">
          Mengautentikasi staff...
        </p>
      </div>
    </div>
  );
}
