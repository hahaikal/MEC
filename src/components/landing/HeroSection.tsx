'use client';

import Image from 'next/image';
import { RegistrationDialog } from './RegistrationDialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const heroImages = [
  '/images/placeholder-1.png',
  '/images/placeholder-2.png',
  '/images/placeholder-3.png',
  '/images/placeholder-4.png'
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900">

      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40">
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          opts={{
            loop: true,
          }}
          className="w-full h-full"
        >
          <CarouselContent className="w-full h-full ml-0">
            {heroImages.map((src, index) => (
              <CarouselItem key={index} className="w-full h-[800px] pl-0 relative">
                <Image
                  src={src}
                  alt={`Hero image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="relative z-10 pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pt-32 lg:pb-48">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-blue-300 ring-1 ring-blue-500/50 hover:ring-blue-400 backdrop-blur-sm bg-black/20">
                New Student Registration is Now Open.{' '}
                <a href="#programs" className="font-semibold text-blue-200">
                  <span className="absolute inset-0" aria-hidden="true" />
                  View Programs <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 drop-shadow-lg">
              <span className="block text-blue-400 mb-2">MEC Academy</span>
              Learn and grow with us
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-200 mb-10 max-w-xl mx-auto drop-shadow-md">
              One Stop Learning Center. Improve your English skills with the best curriculum and professional teaching staff.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <RegistrationDialog>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-blue-500/25 transition-all w-full sm:w-auto">
                  Register Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </RegistrationDialog>
              <a href="https://wa.me/6281274256077?text=Halo%20Admin%20MEC%2C%20saya%20ingin%20konsultasi%20mengenai%20program%20kursus" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 gap-2 px-8 py-6 text-lg rounded-full shadow-lg transition-all border-2 border-blue-600 w-full sm:w-auto">
                  Consultation
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Stats/Features below hero */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center p-6 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 transform transition-transform hover:-translate-y-1">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Modern Curriculum</h3>
                <p className="mt-2 text-center text-sm text-slate-600">Tailored to meet today's academic and professional needs.</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 transform transition-transform hover:-translate-y-1">
                <div className="p-3 bg-green-100 rounded-full mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Professional Teachers</h3>
                <p className="mt-2 text-center text-sm text-slate-600">Guided by experienced and certified educators.</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/20 transform transition-transform hover:-translate-y-1">
                <div className="p-3 bg-amber-100 rounded-full mb-4">
                  <Trophy className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Complete Facilities</h3>
                <p className="mt-2 text-center text-sm text-slate-600">A comfortable learning environment that supports interactive learning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
