"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { BG_CLASSROOM } from "@/lib/parent-hub-data";

export default function LoginPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setAt = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      toast.error("Passcode must be 6 digits", {
        style: { background: "var(--mec-red)", color: "white" },
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("parent-hub-auth", "1");
      router.push("/parent-hub/dashboard");
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Toaster />
      {/* Background image */}
      <img
        src={BG_CLASSROOM}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Frosted overlay */}
      <div
        className="absolute inset-0 backdrop-blur-2xl"
        style={{ background: "color-mix(in oklab, var(--mec-blue) 55%, transparent)" }}
      />
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{ background: "var(--mec-yellow)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30"
        style={{ background: "var(--mec-blue)" }}
      />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-md">
          {/* Mascot placeholder */}
          <div className="absolute left-1/2 -top-12 z-20 -translate-x-1/2">
            <div
              className="grid h-24 w-24 place-items-center rounded-full border-4 border-white/70 shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--mec-yellow), var(--mec-blue))",
              }}
            >
              <span className="text-2xl font-bold text-white">MEC</span>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="rounded-3xl border border-white/40 bg-white/15 p-8 pt-16 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
          >
            <h1 className="text-center text-2xl font-bold text-white">
              Parent Hub
            </h1>
            <p className="mt-1 text-center text-sm text-white/80">
              Enter your 6-digit passcode
            </p>

            <div className="mt-8 flex justify-between gap-2" onPaste={onPaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => setAt(i, e.target.value)}
                  onKeyDown={(e) => onKey(i, e)}
                  className="h-14 w-12 rounded-2xl border border-white/40 bg-white/30 text-center text-2xl font-bold text-white outline-none transition placeholder-white/50 backdrop-blur-md focus:scale-105 focus:border-transparent focus:ring-4 focus:ring-[color:var(--mec-blue)]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-[color:var(--mec-yellow)] py-3.5 text-center font-bold text-neutral-900 shadow-xl transition hover:brightness-95 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
