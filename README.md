MEC Finance System 🚀

MEC Finance System adalah platform manajemen operasional dan keuangan sekolah yang dirancang untuk mengintegrasikan data akademik siswa dengan arus kas lembaga secara real-time. Visi utama proyek ini adalah menghilangkan diskoneksi antara manajemen data siswa dan administrasi keuangan.

1. [Visi & Logika Proyek]

Sistem ini bukan sekadar buku kas digital. Logika arsitekturnya dibangun di atas prinsip:

Data Integrity: Setiap siswa yang terdaftar harus memiliki histori keuangan yang jelas.

Financial Transparency: Memudahkan staf dalam memantau pemasukan (Inbound) dari berbagai sumber dan mengelola pengeluaran (Outbound) operasional.

Proactive Management: Melalui Tuition Matrix, sistem memberikan sinyal dini mengenai tunggakan tanpa perlu pengecekan manual satu-per-satu.

2. [Tujuan Utama (Status Saat Ini)]

Fokus pengembangan kita saat ini (MVP) mencakup:

A. Manajemen Database Siswa (Master Data)
CRUD (Create, Read, Update, Delete) data siswa lengkap.
Pengelolaan status enrollment (Pendaftaran) siswa ke program/kelas tertentu.

B. Pencatatan Keuangan (Pemasukan)
Sistem mampu mencatat berbagai jenis transaksi masuk, antara lain:
SPP Bulanan: Melalui tampilan Matriks untuk pemantauan tahunan.
Registration: Biaya pendaftaran siswa baru.
Books & Uniform: Pembelian aset pendukung pendidikan.
Lain-lain: Pemasukan di luar kategori rutin.

C. Manajemen Pengeluaran (Expenditure)
Pencatatan biaya operasional sekolah.
Tracking pengeluaran untuk memantau sisa saldo (net profit/loss).

3. [Roadmap Pengembangan]
📍 Fase 1: Core Foundation (Sedang Berjalan)
[x] Schema Database & RLS Security.
[x] Autentikasi User (Admin, Manager, Staff).
[x] CRUD Siswa & Enrollment Program.
[ ] Integrasi Matriks Pembayaran SPP yang Fleksibel.

📍 Fase 2: Financial Expansion
[ ] Modul Pengeluaran (Expenses Management).
[ ] Dashboard Ringkasan Transaksi Harian/Bulanan.
[ ] Fitur Cetak Invoice/Kwitansi Otomatis (PDF).

📍 Fase 3: Smart Features & Automation
[ ] Notifikasi WhatsApp Otomatis untuk Tagihan.
[ ] Laporan Analytics Pendapatan & Proyeksi Cashflow.
[ ] Export Data ke Excel untuk Pelaporan Formal.

4. [Stack Teknologi]

Framework: Next.js 14 (App Router)
Styling: Tailwind CSS & shadcn/ui
Database & Auth: Supabase (PostgreSQL)
State Management: TanStack Query (React Query)
Icons: Lucide React

5. [Instruksi Pengoperasian]

Persiapan Environment
Buat file .env.local dan masukkan kredensial Supabase Anda:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Instalasi

# Install dependencies
pnpm install

# Run development server
pnpm dev


Lead Project Manager: [Haikal/ Full-Stack Developer]
Last Updated: Februari 2026