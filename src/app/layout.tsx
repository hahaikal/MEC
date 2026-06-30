import React from "react"
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'

const fontDisplay = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-display',
});

const fontSans = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'My English Course & Academy — Speak English with Confidence',
  description: 'MEC is a friendly English course & academy for kids, teens, and adults. Modern method, certified tutors, and a Parent Hub to track your child\'s progress.',
  openGraph: {
    title: 'My English Course & Academy',
    description: 'Where every voice learns to shine in English. Programs for kids, teens, adults & exam prep.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
