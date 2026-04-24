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
  const message = encodeURIComponent('Hello Admin, I am interested in registering at My English Course & Academy. Could I get more registration information?');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">New Student Registration</DialogTitle>
          <DialogDescription>
            New student registration for My English Course & Academy is currently handled via WhatsApp. Our admin will be happy to assist you with the registration process.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 gap-4">
          <div className="bg-green-50 p-4 rounded-full">
            <MessageCircle className="h-10 w-10 text-green-500" />
          </div>

          <p className="text-center text-slate-600 mb-2">
            Click the button below to connect with our Admin via WhatsApp.
          </p>

          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
            onClick={() => window.open(whatsappUrl, '_blank')}
          >
            <MessageCircle className="h-5 w-5" />
            Contact Admin (WhatsApp)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
