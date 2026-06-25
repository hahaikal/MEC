export function GreetingBanner({ totalItems }: { totalItems: number }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-mec-blue text-white shadow-pop">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-mec-yellow/30 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-6 h-44 w-44 rounded-full bg-mec-yellow/70" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />

      <div className="relative grid gap-6 p-8 sm:p-10 md:grid-cols-[1.4fr_auto] md:items-center">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            Welcome back
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Hello, Parents <span className="inline-block animate-[wiggle_2s_ease-in-out_infinite] origin-bottom-right">👋</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/90 sm:text-base">
            Monitor all programs, classes, and the latest events from My English Course &amp; Academy in one cheerful place.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/15 px-5 py-3 backdrop-blur">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Total Items</span>
            <span className="font-display text-2xl font-bold">{totalItems}</span>
          </div>
        </div>

        {/* School illustration */}
        <div className="relative hidden h-44 w-44 shrink-0 md:block">
          <div className="absolute inset-0 rounded-3xl bg-white/15 backdrop-blur" />
          <div className="absolute inset-0 grid place-items-center text-7xl">🏫</div>
          <div className="absolute -right-2 -top-2 grid h-12 w-12 place-items-center rounded-2xl bg-mec-yellow text-2xl shadow-float">✏️</div>
          <div className="absolute -bottom-3 -left-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-float">🎒</div>
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(18deg); }
          75% { transform: rotate(-12deg); }
        }
      `}</style>
    </section>
  );
}
