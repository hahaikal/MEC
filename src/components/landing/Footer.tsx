import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-md">
                <Image
                  src="/logo.png"
                  alt="My English Course Logo"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-xl font-bold text-white">MEC</span>
            </Link>
            <p className="text-sm leading-6 text-slate-300">
              Learn and grow with us - one stop learning center. Membantu Anda menguasai bahasa Inggris dengan metode pembelajaran yang efektif dan menyenangkan.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-pink-400">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Navigasi</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a href="#about" className="text-sm leading-6 text-slate-300 hover:text-white">
                      Tentang Kami
                    </a>
                  </li>
                  <li>
                    <a href="#programs" className="text-sm leading-6 text-slate-300 hover:text-white">
                      Program
                    </a>
                  </li>
                  <li>
                    <a href="#gallery" className="text-sm leading-6 text-slate-300 hover:text-white">
                      Galeri
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Program Kami</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a href="#programs" className="text-sm leading-6 text-slate-300 hover:text-white">
                      English for Kids
                    </a>
                  </li>
                  <li>
                    <a href="#programs" className="text-sm leading-6 text-slate-300 hover:text-white">
                      General English
                    </a>
                  </li>
                  <li>
                    <a href="#programs" className="text-sm leading-6 text-slate-300 hover:text-white">
                      TOEFL/IELTS Prep
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Hubungi Kami</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex gap-3 text-sm leading-6 text-slate-300">
                    <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <span>Jl. Pendidikan No. 123, Kota Cerdas, Indonesia</span>
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-slate-300">
                    <Phone className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <span>+62 812-3456-7890</span>
                  </li>
                  <li className="flex gap-3 text-sm leading-6 text-slate-300">
                    <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <span>info@myenglishcourse.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} My English Course. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
