"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { BG_CLASSROOM } from "@/lib/parent-hub-data";
import { verifyPin, confirmStudentLogin } from "@/actions/parent-hub-auth";
import { ChevronLeft } from "lucide-react";

interface MatchedStudent {
  id: string;
  name: string;
  photo_url: string | null;
  class_names: string;
  enrollments: { class_id: string; class_name: string; program_id: string; program_name: string }[];
}

export default function LoginPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"pin" | "select">("pin");
  const [matchedStudents, setMatchedStudents] = useState<MatchedStudent[]>([]);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // If already authenticated and session not expired, go to dashboard
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("parent-hub-session");
      if (raw) {
        try {
          const session = JSON.parse(raw);
          const loginAt = new Date(session.loginAt).getTime();
          const now = Date.now();
          const ONE_DAY = 24 * 60 * 60 * 1000;
          if (now - loginAt < ONE_DAY) {
            router.replace("/parent-hub/dashboard");
            return;
          } else {
            // Session expired
            sessionStorage.removeItem("parent-hub-session");
            sessionStorage.removeItem("parent-hub-auth");
          }
        } catch {
          sessionStorage.removeItem("parent-hub-session");
          sessionStorage.removeItem("parent-hub-auth");
        }
      }
    }
  }, [router]);

  useEffect(() => {
    if (step === "pin") {
      inputsRef.current[0]?.focus();
    }
  }, [step]);

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

  const submitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      toast.error("PIN harus 6 digit", {
        style: { background: "var(--mec-red)", color: "white" },
      });
      return;
    }

    setLoading(true);
    try {
      const pin = digits.join("");
      const result = await verifyPin(pin);

      if (result.error) {
        toast.error(result.error, {
          style: { background: "var(--mec-red)", color: "white" },
        });
        setLoading(false);
        return;
      }

      if (result.students && result.students.length === 1) {
        // Only one student matches — login directly
        await selectStudent(result.students[0].id);
      } else if (result.students && result.students.length > 1) {
        // Multiple students match — show selection
        setMatchedStudents(result.students);
        setStep("select");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan, coba lagi nanti");
      setLoading(false);
    }
  };

  const selectStudent = async (studentId: string) => {
    setSelectingId(studentId);
    try {
      const result = await confirmStudentLogin(studentId);
      if (result.error) {
        toast.error(result.error);
        setSelectingId(null);
        return;
      }

      if (result.session) {
        sessionStorage.setItem("parent-hub-session", JSON.stringify(result.session));
        sessionStorage.setItem("parent-hub-auth", "1");
        sessionStorage.setItem("parent-hub-last-active", Date.now().toString());
        router.push("/parent-hub/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal masuk, coba lagi");
      setSelectingId(null);
    }
  };

  const goBack = () => {
    setStep("pin");
    setMatchedStudents([]);
    setDigits(Array(6).fill(""));
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

          {step === "pin" ? (
            <form
              onSubmit={submitPin}
              className="rounded-3xl border border-white/40 bg-white/15 p-8 pt-16 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
            >
              <h1 className="text-center text-2xl font-bold text-white">
                Parent Hub
              </h1>
              <p className="mt-1 text-center text-sm text-white/80">
                Masukkan PIN 6 digit (tanggal lahir siswa)
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

              <p className="mt-3 text-center text-xs text-white/60">
                Format: DD MM YY (contoh: 03 02 15 untuk 3 Februari 2015)
              </p>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-[color:var(--mec-yellow)] py-3.5 text-center font-bold text-neutral-900 shadow-xl transition hover:brightness-95 disabled:opacity-50"
              >
                {loading ? "Memverifikasi..." : "Masuk"}
              </button>
            </form>
          ) : (
            <div className="rounded-3xl border border-white/40 bg-white/15 p-8 pt-16 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <h1 className="text-center text-2xl font-bold text-white">
                Pilih Profil
              </h1>
              <p className="mt-1 text-center text-sm text-white/80">
                Beberapa siswa ditemukan, pilih profil yang sesuai
              </p>

              <div className="mt-6 space-y-3 max-h-[50vh] overflow-y-auto">
                {matchedStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectStudent(s.id)}
                    disabled={!!selectingId}
                    className={`flex w-full items-center gap-4 rounded-2xl border border-white/30 bg-white/20 p-4 text-left backdrop-blur-md transition hover:bg-white/30 hover:scale-[1.02] disabled:opacity-50 ${
                      selectingId === s.id ? "ring-2 ring-[color:var(--mec-yellow)] bg-white/30" : ""
                    }`}
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/50 bg-white/20">
                      {s.photo_url ? (
                        <img
                          src={s.photo_url}
                          alt={s.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white truncate">{s.name}</p>
                      <p className="text-sm text-white/70 truncate">
                        {s.class_names || "Belum ada kelas"}
                      </p>
                    </div>
                    {selectingId === s.id && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={goBack}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
