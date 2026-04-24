import Image from 'next/image';

const features = [
  {
    title: 'Metode Pembelajaran Terbukti',
    description: 'Kami menggunakan pendekatan komunikatif yang mendorong siswa untuk aktif berbicara sejak hari pertama.',
  },
  {
    title: 'Lingkungan Berbahasa Inggris',
    description: 'Seluruh area kursus kami rancang sebagai English Only Area untuk membiasakan siswa berkomunikasi dalam bahasa Inggris.',
  },
  {
    title: 'Evaluasi Berkala',
    description: 'Progress setiap siswa dipantau dan dievaluasi secara berkala untuk memastikan target pembelajaran tercapai.',
  },
  {
    title: 'Dukungan Digital',
    description: 'Akses ke materi e-learning dan tugas tambahan melalui platform digital kami yang dapat diakses kapan saja.',
  }
];

export function FeaturesSection() {
  return (
    <section id="about" className="py-24 bg-slate-50 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">

            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-blue-600">Kenapa Memilih Kami?</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pencapaian & Keunggulan MEC</p>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Ratusan siswa telah mempercayakan perjalanan bahasa Inggris mereka bersama My English Course. Kami berkomitmen memberikan pengalaman belajar terbaik.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-slate-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.title} className="relative pl-9">
                      <dt className="inline font-semibold text-slate-900">
                        <div className="absolute left-1 top-1 h-5 w-5 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        {feature.title}.
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="relative">
              {/* Illustration Placeholder */}
              <div className="aspect-[4/3] w-full rounded-2xl bg-slate-200 overflow-hidden shadow-xl ring-1 ring-slate-400/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Ilustrasi / Foto Kelas MEC</h3>
                  <p className="text-sm text-slate-500 mt-2">(Dapat diganti dengan foto asli kegiatan belajar via Admin Panel)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
