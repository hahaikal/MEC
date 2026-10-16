
const programs = [
  {
    number: "01",
    title: "English Course",
    description:
      "Belajar bahasa Inggris melalui kegiatan yang interaktif untuk meningkatkan vocabulary, grammar, listening, reading, writing, dan speaking.",
  },
  {
    number: "02",
    title: "MEC Smart Program",
    description:
      "Bimbingan belajar berbagai mata pelajaran dengan pendampingan yang membantu siswa memahami materi secara bertahap.",
  },
  {
    number: "03",
    title: "MEC Preschool",
    description:
      "Pengalaman belajar anak usia dini yang menyenangkan melalui aktivitas kreatif, eksplorasi, literasi, dan pengembangan keterampilan.",
  },
  {
    number: "04",
    title: "Speaking Class",
    description:
      "Kesempatan untuk berlatih berbicara bahasa Inggris, membangun kepercayaan diri, dan berkomunikasi dengan lebih baik.",
  },
];

const values = [
  {
    title: "Student-Centered",
    description:
      "Memperhatikan kebutuhan, kemampuan, dan perkembangan setiap siswa.",
  },
  {
    title: "Fun Learning",
    description:
      "Menciptakan pengalaman belajar yang aktif, menarik, dan bermakna.",
  },
  {
    title: "Continuous Growth",
    description:
      "Mendorong siswa untuk terus belajar, berkembang, dan berani mencoba.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800">
      {/* NAVBAR */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-lg font-black tracking-tight text-white">
              MEC
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wide text-blue-950">
                MY ENGLISH COURSE
              </p>
              <p className="text-xs font-medium tracking-[0.2em] text-slate-500">
                & ACADEMY
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="/" className="transition hover:text-blue-700">
              Home
            </a>
            <a href="/about" className="font-bold text-blue-900">
              About Us
            </a>
            <a href="/programs" className="transition hover:text-blue-700">
              Programs
            </a>
            <a href="/contact" className="transition hover:text-blue-700">
              Contact
            </a>
          </nav>

          <a
            href="https://www.instagram.com/myenglishcoursebaganbatu/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Get in Touch
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative bg-blue-950">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-800/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
              Get to Know Us
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Growing Minds,
              <span className="block text-sky-300">
                Building Futures.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-blue-100 md:text-lg">
              At My English Course & Academy, we believe every student has
              the potential to grow. We create a supportive learning
              environment where students can develop their knowledge,
              confidence, and skills for the future.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#our-story"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-blue-950 transition hover:bg-sky-100"
              >
                Discover Our Story
              </a>
              <a
                href="#our-programs"
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Programs
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
              <div className="flex min-h-[340px] flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-sky-100 via-white to-blue-100 p-7 md:min-h-[390px] md:p-10">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-950 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                    Welcome to MEC
                  </span>
                  <span className="text-3xl text-blue-900">✦</span>
                </div>

                <div>
                  <div className="mb-5 flex items-end gap-2">
                    <div className="h-20 w-20 rounded-t-full rounded-br-2xl bg-blue-950" />
                    <div className="h-28 w-20 rounded-t-full rounded-bl-2xl rounded-br-2xl bg-sky-500" />
                    <div className="h-16 w-20 rounded-t-full rounded-bl-2xl bg-blue-300" />
                  </div>
                  <p className="text-3xl font-black leading-tight tracking-tight text-blue-950 md:text-4xl">
                    Learn Today.
                    <br />
                    Lead Tomorrow.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Knowledge, confidence, and endless possibilities.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-blue-200 pt-5">
                  <span className="text-xs font-bold tracking-widest text-blue-950">
                    LEARN · GROW · SHINE
                  </span>
                  <span className="text-xl text-blue-800">↗</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 shadow-xl">
              <p className="text-xs font-medium text-slate-500">
                Our commitment
              </p>
              <p className="mt-1 font-bold text-blue-950">
                Every learner matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="scroll-mt-10 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
              Who We Are
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-blue-950 md:text-4xl">
              More Than Just a Place to Learn
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              My English Course & Academy (MEC) is a learning center
              dedicated to helping children and students develop their
              academic abilities and essential life skills.
            </p>
            <p>
              We offer a variety of learning programs designed to support
              students at different stages of their educational journey.
              Through meaningful activities and supportive guidance, we
              encourage learners to explore their potential and become
              more confident in their abilities.
            </p>
            <p>
              At MEC, learning is not only about achieving better results.
              It is also about building good habits, developing curiosity,
              and preparing students to face new challenges.
            </p>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
              What Guides Us
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 md:text-4xl">
              Our Vision & Mission
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Our purpose is to make learning a meaningful experience that
              helps every student move forward with confidence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl bg-blue-950 p-8 text-white md:p-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                ◎
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="mt-5 leading-8 text-blue-100">
                To become a trusted learning community that empowers
                students to become confident, capable, and lifelong learners.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl text-blue-900">
                ↗
              </div>
              <h3 className="text-2xl font-bold text-blue-950">
                Our Mission
              </h3>
              <ul className="mt-5 space-y-4 leading-7 text-slate-600">
                <li className="flex gap-3">
                  <span className="font-bold text-sky-600">01</span>
                  Provide engaging and meaningful learning experiences.
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-sky-600">02</span>
                  Support individual growth through guidance and practice.
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-sky-600">03</span>
                  Encourage confidence, curiosity, and positive learning habits.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="our-programs"
        className="scroll-mt-10 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
                Learning at MEC
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-blue-950 md:text-4xl">
                Programs for Every Stage
              </h2>
            </div>
            <p className="max-w-md leading-7 text-slate-600">
              Different learning pathways, one shared goal: helping every
              student grow and reach their potential.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {programs.map((program) => (
              <article
                key={program.number}
                className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 md:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-sky-600">
                    {program.number}
                  </span>
                  <span className="text-2xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700">
                    ↗
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-bold text-blue-950">
                  {program.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {program.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
              What We Believe
            </p>
            <h2 className="mt-4 text-3xl font-bold text-blue-950 md:text-4xl">
              The Values Behind MEC
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950 text-xl font-bold text-white">
                  {value.title === "Student-Centered"
                    ? "01"
                    : value.title === "Fun Learning"
                      ? "02"
                      : "03"}
                </div>
                <h3 className="mt-5 text-lg font-bold text-blue-950">
                  {value.title}
                </h3>
                <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-blue-950 px-7 py-12 text-center md:px-16 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300">
            Your Learning Journey Starts Here
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-white md:text-5xl">
            Let&apos;s Grow and Learn Together.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Discover a learning experience that supports your child&apos;s
            growth, confidence, and future.
          </p>
          <a
            href="https://www.instagram.com/myenglishcoursebaganbatu/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-bold text-blue-950 transition hover:bg-sky-100"
          >
            Contact MEC
            <span className="ml-3">↗</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="font-extrabold tracking-wide text-blue-950">
              MY ENGLISH COURSE & ACADEMY
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Learn Today. Lead Tomorrow.
            </p>
          </div>

          <div className="text-sm leading-6 text-slate-500 md:text-right">
            <p>Bagan Batu, Rokan Hilir, Riau, Indonesia</p>
            <a
              href="https://www.instagram.com/myenglishcoursebaganbatu/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-800 hover:underline"
            >
              Instagram: @myenglishcoursebaganbatu
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}