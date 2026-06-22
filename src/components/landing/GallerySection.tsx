import Image from 'next/image';

const galleryItems = [
  {
    id: 1,
    title: 'To JCO',
    category: 'Field Trips',
    image: '/images/placeholder-8.png'
  },
  {
    id: 2,
    title: 'Classroom Activity',
    category: 'Classrooms & Daily Learning',
    image: '/images/placeholder-9.png'
  },
  {
    id: 3,
    title: 'Classroom Activity',
    category: 'Classrooms & Daily Learning',
    image: '/images/placeholder-10.png'
  },
  {
    id: 4,
    title: 'To Ichiban Sushi',
    category: 'Field Trips',
    image: '/images/placeholder-11.png'
  },
  {
    id: 5,
    title: 'Halloween',
    category: 'Special Events',
    image: '/images/placeholder-12.png'
  },
  {
    id: 6,
    title: 'Physics education',
    category: 'Classrooms & Daily Learning',
    image: '/images/placeholder-13.png'
  },
  {
    id: 7,
    title: 'End of Year Concert',
    category: 'Special Events',
    image: '/images/placeholder-14.jpg'
  },
  {
    id: 8,
    title: 'Art',
    category: 'Classrooms & Daily Learning',
    image: '/images/placeholder-15.png'
  },
  {
    id: 9,
    title: 'Music',
    category: 'Classrooms & Daily Learning',
    image: '/images/placeholder-16.png'
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 bg-slate-50 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Activity Gallery</h2>
          <p className="mt-4 text-lg text-slate-600">
            Take a peek at the exciting teaching and learning activities and various engaging events at MEC Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-slate-200 aspect-video shadow-md cursor-pointer">
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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
