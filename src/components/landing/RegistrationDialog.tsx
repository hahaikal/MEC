'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';

export function RegistrationDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // You can replace this with the actual WhatsApp number of the admin
  const whatsappNumber = '6281234567890';
  const message = encodeURIComponent('Halo Admin, saya tertarik untuk mendaftar di My English Course. Boleh minta informasi pendaftaran lebih lanjut?');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Pendaftaran Siswa Baru</DialogTitle>
          <DialogDescription>
            Pendaftaran siswa baru My English Course saat ini dilayani melalui WhatsApp. Admin kami akan dengan senang hati membantu proses pendaftaran Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 gap-4">
          <div className="bg-green-50 p-4 rounded-full">
            <MessageCircle className="h-10 w-10 text-green-500" />
          </div>

          <p className="text-center text-slate-600 mb-2">
            Klik tombol di bawah ini untuk terhubung dengan Admin kami via WhatsApp.
          </p>

          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <MessageCircle className="h-5 w-5" />
            Hubungi Admin (WhatsApp)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
