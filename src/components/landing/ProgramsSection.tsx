import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistrationDialog } from './RegistrationDialog';

const programs = [
  {
    name: 'MEC PRESCHOOL',
    description: 'Early childhood English education introducing basic vocabulary and conversation through play, songs, and interactive activities.',
    features: [
      'Play-based Learning',
      'Basic Phonics & Vocabulary',
      'Motor Skills Development',
      'Fun & Safe Environment'
    ],
    popular: false
  },
  {
    name: 'English for Kids',
    description: 'Interactive English program for children aged 6-12. Focuses on building a strong foundation in vocabulary and basic conversational skills.',
    features: [
      'Interactive Learning Games',
      'Basic Vocabulary & Grammar',
      'Fun Speaking Practice',
      'Regular Progress Reports'
    ],
    popular: true
  },
  {
    name: 'Regular English',
    description: 'Comprehensive program for teens and adults. Enhances all four core skills: speaking, listening, reading, and writing.',
    features: [
      'Comprehensive Curriculum',
      'Native-like Speaking Practice',
      'Real-world Scenarios',
      'Certificate of Completion'
    ],
    popular: false
  },
  {
    name: 'Calistung',
    description: 'Specialized program focusing on early Reading, Writing, and Arithmetic (Membaca, Menulis, Berhitung) to prepare children for primary school.',
    features: [
      'Early Literacy Skills',
      'Basic Arithmetic',
      'Interactive Worksheets',
      'Personalized Attention'
    ],
    popular: false
  },
  {
    name: 'Bimbel',
    description: 'Academic tutoring program to help students excel in their school subjects and prepare for major examinations.',
    features: [
      'School Curriculum Alignment',
      'Homework Assistance',
      'Exam Preparation',
      'Intensive Practice Sessions'
    ],
    popular: false
  }
];

export function ProgramsSection() {
  return (
    <section id="programs" className="py-24 bg-white sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Excellent Programs</h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the program that best suits your needs and goals.
          </p>
        </div>

        {/* Use a flex layout that wraps to handle 5 items gracefully */}
        <div className="mx-auto flex flex-wrap justify-center gap-8 max-w-7xl">
          {programs.map((program) => (
            <div
              key={program.name}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:p-10 ${
                program.popular ? 'ring-2 ring-blue-600 shadow-xl scale-105 z-10' : 'ring-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={`text-xl font-semibold leading-8 ${program.popular ? 'text-blue-600' : 'text-slate-900'}`}>
                    {program.name}
                  </h3>
                  {program.popular && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600 whitespace-nowrap">
                      Most Popular
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
                    Select Program
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
