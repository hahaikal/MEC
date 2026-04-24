import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistrationDialog } from './RegistrationDialog';

const programs = [
  {
    name: 'English for Kids',
    description: 'Program bahasa Inggris interaktif untuk anak usia 6-12 tahun. Fokus pada pengenalan kosa kata dan percakapan dasar yang menyenangkan.',
    features: [
      'Interactive Learning Games',
      'Basic Vocabulary & Grammar',
      'Fun Speaking Practice',
      'Progress Report Berkala'
    ],
    popular: false
  },
  {
    name: 'General English',
    description: 'Program komprehensif untuk remaja dan dewasa. Meningkatkan kemampuan speaking, listening, reading, dan writing.',
    features: [
      'Comprehensive Curriculum',
      'Native-like Speaking Practice',
      'Real-world Scenarios',
      'Sertifikat Penyelesaian'
    ],
    popular: true
  },
  {
    name: 'TOEFL/IELTS Preparation',
    description: 'Persiapan intensif untuk meraih skor target TOEFL atau IELTS Anda dengan strategi yang terbukti efektif.',
    features: [
      'Intensive Practice Tests',
      'Proven Test Strategies',
      'Feedback & Evaluation',
      'Simulation Tests'
    ],
    popular: false
  }
];

export function ProgramsSection() {
  return (
    <section id="programs" className="py-24 bg-white sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Program Unggulan Kami</h2>
          <p className="mt-4 text-lg text-slate-600">
            Pilih program yang sesuai dengan kebutuhan dan tujuan Anda dalam mempelajari bahasa Inggris.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.name}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 xl:p-10 ${
                program.popular ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'ring-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={`text-xl font-semibold leading-8 ${program.popular ? 'text-blue-600' : 'text-slate-900'}`}>
                    {program.name}
                  </h3>
                  {program.popular && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                      Terpopuler
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {program.description}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <RegistrationDialog>
                  <Button
                    className={`w-full ${program.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                  >
                    Pilih Program Ini
                  </Button>
                </RegistrationDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
