'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const features = [
  {
    title: 'Proven Learning Method',
    description: 'We use a communicative approach that encourages students to actively speak from day one.',
  },
  {
    title: 'English Environment',
    description: 'Our entire course area is designed as an English Only Area to accustom students to communicating in English.',
  },
  {
    title: 'Regular Evaluation',
    description: 'Each student\'s progress is monitored and evaluated regularly to ensure learning targets are met.',
  },
  {
    title: 'Digital Support',
    description: 'Access to e-learning materials and additional assignments through our digital platform, available anytime.',
  }
];

const featureImages = [
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'
];

export function FeaturesSection() {
  return (
    <section id="about" className="py-24 bg-slate-50 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">

            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-blue-600">Why Choose Us?</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Achievements & Advantages</p>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Hundreds of students have trusted their English language journey with MEC Academy. We are committed to providing the best learning experience.
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
              {/* Scattered Unique Carousel */}
              <div className="relative w-full aspect-[4/3]">
                <div className="absolute inset-0 transform translate-x-4 translate-y-4 rounded-2xl border-2 border-blue-100 bg-blue-50/50 -z-10" />
                <div className="absolute inset-0 transform -translate-x-4 -translate-y-4 rounded-2xl border-2 border-amber-100 bg-amber-50/50 -z-20" />

                <Carousel
                  plugins={[
                    Autoplay({
                      delay: 3500,
                    }),
                  ]}
                  opts={{
                    loop: true,
                  }}
                  className="w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10"
                >
                  <CarouselContent className="w-full h-full ml-0">
                    {featureImages.map((src, index) => (
                      <CarouselItem key={index} className="w-full h-full pl-0 relative aspect-[4/3]">
                        <Image
                          src={src}
                          alt={`MEC Activity ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute bottom-4 right-16 flex gap-2">
                    <CarouselPrevious className="relative inset-0 translate-y-0 h-8 w-8 bg-white/80 hover:bg-white text-slate-800" />
                    <CarouselNext className="relative inset-0 translate-y-0 h-8 w-8 bg-white/80 hover:bg-white text-slate-800" />
                  </div>
                </Carousel>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
