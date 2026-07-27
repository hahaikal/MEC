"use client";

import { useState } from "react";
import { FileText, CalendarCheck, HelpCircle, AlertCircle, ChevronDown, Download, FileSignature } from "lucide-react";

export default function ResourcesPage() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const requestForms = [
    {
      id: 1,
      title: "Leave Request",
      desc: "Submit a formal absence request for your child.",
      icon: FileSignature,
    },
    {
      id: 2,
      title: "Event Registration",
      desc: "Sign up for upcoming extracurricular events.",
      icon: CalendarCheck,
    },
    {
      id: 3,
      title: "Health Declaration",
      desc: "Update your child's medical information.",
      icon: AlertCircle,
    },
    {
      id: 4,
      title: "Document Request",
      desc: "Request transcripts or certificates.",
      icon: FileText,
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "What are the school's operating hours?",
      answer: "The school is open from Monday to Friday, 07:30 AM to 03:00 PM. Extracurricular activities usually take place between 03:15 PM and 05:00 PM.",
    },
    {
      id: 2,
      question: "How do I report my child's absence?",
      answer: "You can use the 'Leave Request' form available on this page, or directly contact the homeroom teacher via the Communication tab before 08:00 AM on the day of the absence.",
    },
    {
      id: 3,
      question: "What is the policy on late tuition payments?",
      answer: "Tuition fees are due on the 10th of every month. Payments received after the 15th will incur a 5% late fee penalty. Please refer to the Financial Policy document for more details.",
    },
    {
      id: 4,
      question: "Can I schedule a meeting with a teacher?",
      answer: "Yes, parent-teacher meetings can be scheduled by sending a request through the Communication tab. Teachers are generally available for meetings on Wednesdays after 02:00 PM.",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-extrabold text-[#111111]">Pusat Bantuan & Regulasi</h1>
        <p className="mt-2 text-lg text-neutral-600">Quick access to essential forms, policies, and frequently asked questions.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left Column: Forms & Requests */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mec-blue/10 text-mec-blue">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#111111]">Forms & Requests</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {requestForms.map((form) => (
              <button 
                key={form.id}
                className="group flex flex-col items-start gap-4 rounded-3xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-mec-blue/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2F2F2] text-[#111111] transition-colors group-hover:bg-mec-blue group-hover:text-white">
                  <form.icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-lg font-bold text-[#111111]">{form.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{form.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Right Column: Policies & FAQ */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mec-yellow/20 text-mec-yellow">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#111111]">Policies & FAQ</h2>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-card">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border-b border-neutral-100 last:border-none ${
                    isOpen ? "bg-[#F2F2F2]/50" : "bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#F2F2F2]/80"
                  >
                    <span className="font-display text-lg font-bold text-[#111111]">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-mec-blue" : ""}`} />
                  </button>
                  
                  <div 
                    className={`overflow-hidden px-6 transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-base leading-relaxed text-[#111111]/80">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Download Policies Card */}
          <div className="mt-8 rounded-3xl bg-[#111111] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-mec-blue/30 blur-3xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Student Handbook 2026</h3>
                <p className="mt-1 text-sm text-neutral-400">Download the complete academic and operational policies in PDF format.</p>
              </div>
              <button className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-mec-yellow px-6 py-3 text-sm font-bold text-mec-ink transition-transform hover:scale-105">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
