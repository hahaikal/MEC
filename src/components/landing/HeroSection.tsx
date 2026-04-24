'use client';

import Image from 'next/image';
import { RegistrationDialog } from './RegistrationDialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pt-32 lg:pb-48">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-blue-600 ring-1 ring-blue-600/20 hover:ring-blue-600/40">
              Pendaftaran Siswa Baru Telah Dibuka.{' '}
              <a href="#programs" className="font-semibold text-blue-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Lihat Program <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
            <span className="block text-blue-700 mb-2">My English Course</span>
            Learn and grow with us
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 mb-10 max-w-xl mx-auto">
            One Stop Learning Center. Tingkatkan kemampuan bahasa Inggris Anda dengan kurikulum terbaik dan tenaga pengajar profesional.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <RegistrationDialog>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 py-6 text-lg rounded-full">
                Pendaftaran Siswa Baru
                <ArrowRight className="h-5 w-5" />
              </Button>
            </RegistrationDialog>
          </div>
        </div>

        {/* Quick Stats/Features below hero */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="p-3 bg-blue-50 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Kurikulum Modern</h3>
              <p className="mt-2 text-center text-sm text-slate-600">Disusun menyesuaikan kebutuhan akademik dan profesional masa kini.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="p-3 bg-green-50 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Pengajar Profesional</h3>
              <p className="mt-2 text-center text-sm text-slate-600">Dibimbing oleh tenaga pengajar yang berpengalaman dan tersertifikasi.</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="p-3 bg-amber-50 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Fasilitas Lengkap</h3>
              <p className="mt-2 text-center text-sm text-slate-600">Lingkungan belajar yang nyaman dan mendukung proses belajar interaktif.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
