"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound404() {
  const router = useRouter();
  
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-mec-ink">
      {/* Soft grey backdrop blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface blur-2xl"
      />

      {/* Floating background shapes */}
      <BackgroundShapes />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Tag pill */}
        <span className="mec-anim-pop inline-flex items-center gap-2 rounded-full bg-mec-yellow px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-mec-ink shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          Error 404
        </span>

        {/* Mascot + 404 */}
        <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:gap-10">
          <Digit char="4" delay="0s" />
          <Mascot />
          <Digit char="4" delay="0.25s" />
        </div>

        <h1 className="mec-anim-pop mt-10 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-mec-ink md:text-5xl">
          Oops, this lesson is{" "}
          <span className="relative inline-block">
            <span className="relative z-10">missing!</span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-mec-yellow md:h-4"
            />
          </span>
        </h1>
        <p className="mec-anim-pop mt-4 max-w-xl text-base text-mec-ink/70 md:text-lg">
          The page you're looking for seems to have skipped class. Let's head back to the homepage and continue your learning adventure!
        </p>

        <div className="mec-anim-pop mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-mec-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-mec-blue/25 transition-transform hover:scale-105 hover:bg-mec-blue/90"
          >
            Back to Homepage
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-full border-2 border-mec-ink/10 bg-background px-6 py-3 text-sm font-semibold text-mec-ink transition-transform hover:scale-105 hover:border-mec-blue hover:text-mec-blue"
          >
            Previous Page
          </button>
        </div>
      </div>
    </main>
  );
}

function Digit({ char, delay }: { char: string; delay: string }) {
  return (
    <span
      className="mec-anim-float select-none text-[9rem] font-black leading-none text-mec-blue drop-shadow-[0_10px_0_rgba(29,117,192,0.15)] md:text-[12rem]"
      style={{ animationDelay: delay }}
    >
      {char}
    </span>
  );
}

/** Cute graduate owl mascot with independent animations */
function Mascot() {
  return (
    <div className="relative mec-anim-float-sm">
      {/* Orbiting book */}
      <div
        aria-hidden
        className="absolute -left-10 top-4 mec-anim-drift"
        style={{ animationDelay: "0.4s" }}
      >
        <BookIcon />
      </div>
      {/* Orbiting pencil */}
      <div
        aria-hidden
        className="absolute -right-8 -top-4 mec-anim-drift"
        style={{ animationDelay: "1.2s" }}
      >
        <PencilIcon />
      </div>
      {/* Orbiting star */}
      <div
        aria-hidden
        className="absolute -right-12 bottom-6 mec-anim-spin-slow"
      >
        <StarIcon />
      </div>

      <svg
        role="img"
        aria-label="Owl mascot with graduation cap"
        viewBox="0 0 220 240"
        className="h-56 w-56 md:h-72 md:w-72"
      >
        {/* Body */}
        <ellipse cx="110" cy="145" rx="72" ry="78" fill="#1D75C0" />
        {/* Belly */}
        <ellipse cx="110" cy="160" rx="45" ry="52" fill="#F2F2F2" />
        {/* Feet */}
        <ellipse cx="88" cy="220" rx="14" ry="6" fill="#F7E04C" />
        <ellipse cx="132" cy="220" rx="14" ry="6" fill="#F7E04C" />
        {/* Wing (waving) */}
        <g
          className="mec-anim-wave"
          style={{ transformOrigin: "170px 150px" }}
        >
          <path
            d="M170 150 Q200 155 195 190 Q180 200 165 185 Z"
            fill="#155a94"
          />
        </g>
        {/* Left wing */}
        <path
          d="M50 150 Q20 155 25 190 Q40 200 55 185 Z"
          fill="#155a94"
        />
        {/* Eyes whites */}
        <circle cx="86" cy="120" r="22" fill="#FFFFFF" />
        <circle cx="134" cy="120" r="22" fill="#FFFFFF" />
        {/* Eyes pupils (blinking) */}
        <g className="mec-anim-blink" style={{ transformOrigin: "86px 120px" }}>
          <circle cx="86" cy="122" r="9" fill="#111111" />
          <circle cx="89" cy="118" r="3" fill="#FFFFFF" />
        </g>
        <g
          className="mec-anim-blink"
          style={{ transformOrigin: "134px 120px", animationDelay: "0.15s" }}
        >
          <circle cx="134" cy="122" r="9" fill="#111111" />
          <circle cx="137" cy="118" r="3" fill="#FFFFFF" />
        </g>
        {/* Beak */}
        <path d="M110 132 L102 146 L118 146 Z" fill="#F7E04C" />
        {/* Cheeks */}
        <circle cx="70" cy="148" r="6" fill="#F7E04C" opacity="0.6" />
        <circle cx="150" cy="148" r="6" fill="#F7E04C" opacity="0.6" />

        {/* Graduation cap */}
        <g>
          <rect x="70" y="66" width="80" height="10" rx="2" fill="#111111" />
          <polygon points="110,40 170,66 110,80 50,66" fill="#111111" />
          {/* Tassel */}
          <line
            x1="160"
            y1="66"
            x2="170"
            y2="92"
            stroke="#F7E04C"
            strokeWidth="3"
          />
          <circle cx="170" cy="94" r="4" fill="#F7E04C" />
        </g>
      </svg>
    </div>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 md:h-12 md:w-12">
      <rect x="4" y="6" width="32" height="28" rx="3" fill="#F7E04C" />
      <rect x="4" y="6" width="32" height="6" fill="#1D75C0" />
      <line x1="20" y1="12" x2="20" y2="34" stroke="#111" strokeWidth="1.5" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 md:h-11 md:w-11">
      <rect
        x="6"
        y="16"
        width="26"
        height="8"
        rx="1"
        fill="#F7E04C"
        transform="rotate(-25 20 20)"
      />
      <polygon points="4,22 12,18 12,26" fill="#111" transform="rotate(-25 20 20)" />
      <rect x="28" y="16" width="4" height="8" fill="#E11D2A" transform="rotate(-25 20 20)" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 md:h-10 md:w-10">
      <polygon
        points="12,2 15,9 22,9.5 16.5,14 18,21 12,17.5 6,21 7.5,14 2,9.5 9,9"
        fill="#F7E04C"
        stroke="#1D75C0"
        strokeWidth="1"
      />
    </svg>
  );
}

function BackgroundShapes() {
  const shapes = [
    { top: "8%", left: "8%", delay: "0s", el: <StarIcon /> },
    { top: "18%", right: "12%", delay: "1s", el: <BookIcon /> },
    { bottom: "14%", left: "10%", delay: "0.6s", el: <PencilIcon /> },
    { bottom: "10%", right: "8%", delay: "1.4s", el: <StarIcon /> },
    { top: "55%", left: "4%", delay: "2s", el: <StarIcon /> },
    { top: "60%", right: "5%", delay: "0.3s", el: <BookIcon /> },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute opacity-70 mec-anim-drift"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            animationDelay: s.delay,
          }}
        >
          {s.el}
        </div>
      ))}
      {/* Dots */}
      <div className="absolute left-[20%] top-[30%] h-2 w-2 rounded-full bg-mec-blue/40 mec-anim-float-sm" />
      <div className="absolute right-[22%] top-[40%] h-3 w-3 rounded-full bg-mec-yellow mec-anim-float-sm" style={{ animationDelay: "0.8s" }} />
      <div className="absolute left-[30%] bottom-[22%] h-2 w-2 rounded-full bg-destructive/60 mec-anim-float-sm" style={{ animationDelay: "1.6s" }} />
    </div>
  );
}
