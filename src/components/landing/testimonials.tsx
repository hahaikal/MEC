import { Star } from "lucide-react";

export function Testimonials() {
  const quotes = [
    {
      q: "Best English course in Bagan batu , with qualified teachers and many staff admins to handle more than 300students. May MEC be succeed and get more students each year.",
      n: "Sylvia Limyap",
      r: "Parent of ...",
    },
    {
      q: "Kedua anak saya les di sini dan hasilnya sangat memuaskan! Sistem belajarnya sangat disukai anak-anak, ditambah lagi para pengajarnya sangat berpengalaman. Si adik sudah mulai ikut dari usia 3 tahun, sedangkan si abang sejak usia TK. Anak-anak selalu pulang dengan ceria dan senang belajar di sini.",
      n: "Beby Susanti",
      r: "Parent of Rassya & ...",
    },
    {
      q: "Sangat puas dengan perkembangan anak pertama saya sejak les di sini. Kedekatan para Miss dengan anak-anak membuat suasana belajar jadi begitu nyaman. Itulah yang membuat saya mantap untuk mendaftarkan kedua adiknya juga. Rekomendasi tempat les terbaik, semoga kualitasnya tetap terjaga dan semakin maju!",
      n: "Laurenzia Tambunan",
      r: "Parent of ...",
    },
  ];
  return (
    <section className="py-20 md:py-24 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-foreground">
            Loved by parents & students.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {quotes.map((t) => (
            <div
              key={t.n}
              className="rounded-3xl bg-card border border-border p-7 shadow-card flex flex-col"
            >
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent" />
                ))}
              </div>
              <p className="mt-4 text-foreground/90 italic">"{t.q}"</p>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="font-semibold text-foreground text-sm">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
