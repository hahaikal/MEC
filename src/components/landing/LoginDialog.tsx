'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'selection' | 'student'>('selection');
  const router = useRouter();

  const handleStaffLogin = () => {
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setMode('selection');
    }}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {mode === 'selection' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Masuk ke Sistem</DialogTitle>
              <DialogDescription className="text-center">
                Silahkan pilih metode masuk sesuai dengan peran Anda.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Button
                onClick={() => setMode('student')}
                variant="outline"
                className="h-16 flex items-center justify-start gap-4 px-6 border-blue-200 hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Login sebagai Siswa</div>
                  <div className="text-xs text-slate-500">Untuk melihat jadwal, e-learning, & tagihan</div>
                </div>
              </Button>

              <Button
                onClick={handleStaffLogin}
                variant="outline"
                className="h-16 flex items-center justify-start gap-4 px-6 border-slate-200 hover:border-slate-500 hover:bg-slate-50"
              >
                <div className="bg-slate-100 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-slate-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Login sebagai Staff</div>
                  <div className="text-xs text-slate-500">Untuk Admin, Teacher & Direktur</div>
                </div>
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Login Siswa</DialogTitle>
              <DialogDescription>
                Fitur ini sedang dalam tahap pengembangan. Silahkan hubungi admin untuk informasi lebih lanjut.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4 opacity-50 pointer-events-none">
              <div className="grid gap-2">
                <Label htmlFor="nis">Nomor Induk Siswa (NIS)</Label>
                <Input id="nis" placeholder="Masukkan NIS Anda" disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" disabled />
              </div>
              <Button disabled className="w-full">Masuk</Button>
            </div>
            <Button variant="ghost" onClick={() => setMode('selection')} className="mt-2">
              Kembali
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
