"use client";

import { motion } from "framer-motion";

export function Star4({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M20 2c1.5 8 4 12.5 18 18-14 5.5-16.5 10-18 18-1.5-8-4-12.5-18-18C16 14.5 18.5 10 20 2Z"
        fill="currentColor"
      />
    </motion.svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 -10 90 60"
      fill="none"
      className={className}
      aria-hidden="true"
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M20 42h52a14 14 0 0 0 2.6-27.7A20 20 0 0 0 36 8a20 20 0 0 0-17.7 10.7A13 13 0 0 0 20 42Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export function Balloon({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 40 70"
      fill="none"
      className={className}
      aria-hidden="true"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <ellipse cx="20" cy="20" rx="15" ry="18" fill="currentColor" />
      <path d="M20 38c-2 8 4 12-2 20 8-6 0-12 6-20" stroke="currentColor" strokeWidth="2" fill="none" />
    </motion.svg>
  );
}

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M2 12c10-12 20-12 30 0s20 12 30 0 20-12 30 0 20 12 26 6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DotsGrid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <circle key={`${r}-${c}`} cx={6 + c * 16} cy={6 + r * 16} r="3" fill="currentColor" />
        )),
      )}
    </svg>
  );
}

export function ScallopEdge({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "rotate(180deg)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M0 60V30C40 5 80 5 120 30s80 25 120 0 80-25 120 0 80 25 120 0 80-25 120 0 80 25 120 0 80-25 120 0 80 25 120 0 80-25 120 0 80 25 120 0 80-25 120 0 80 25 120 0v30Z"
        fill="currentColor"
      />
    </svg>
  );
}
