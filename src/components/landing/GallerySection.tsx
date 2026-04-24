import Image from 'next/image';

const galleryItems = [
  { id: 1, title: 'Kegiatan Belajar di Kelas', category: 'Classroom' },
  { id: 2, title: 'English Competition', category: 'Event' },
  { id: 3, title: 'Kelulusan Siswa', category: 'Graduation' },
  { id: 4, title: 'Diskusi Kelompok', category: 'Classroom' },
  { id: 5, title: 'Praktek Berbicara', category: 'Practice' },
  { id: 6, title: 'Acara Tahunan MEC', category: 'Event' },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-slate-50 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Galeri Kegiatan</h2>
          <p className="mt-4 text-lg text-slate-600">
            Intip keseruan kegiatan belajar mengajar dan berbagai acara menarik di My English Course.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-slate-200 aspect-video shadow-md">
              {/* Image Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-300">
                <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-sm font-medium text-blue-300 mb-1">{item.category}</span>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
