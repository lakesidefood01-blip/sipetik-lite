# SIPETIK Lite

Aplikasi manajemen sapi sederhana untuk peternak kecil dan penggemukan sapi skala kecil.

## Fitur Utama

- **Dashboard Modern**: Statistik populasi, biaya pakan, ADG (Average Daily Gain), dan pengingat kesehatan.
- **Manajemen Sapi**: CRUD data sapi lengkap dengan status, riwayat berat, dan pakan.
- **Pencatatan Pakan**: Monitor konsumsi pakan harian dan biaya otomatis yang terintegrasi dengan keuangan.
- **Riwayat Berat Badan**: Pantau pertumbuhan sapi dengan grafik dan perhitungan kenaikan otomatis.
- **Manajemen Keuangan**: Laporan arus kas, laba rugi, dan biaya operasional per sapi.
- **Reminder Kesehatan**: Jadwal vaksinasi, vitamin, dan obat-obatan dengan status monitoring.
- **Mobile First**: Desain responsif yang nyaman digunakan di perangkat seluler di lapangan.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, shadcn/ui, Recharts, Zustand.
- **Backend**: Express (Node.js), Supabase.
- **Database**: Supabase PostgreSQL + Auth + Storage.

## Setup & Instalasi

### 1. Database & Auth (Supabase)
1. Buat proyek baru di [Supabase](https://supabase.com).
2. Jalankan SQL yang ada di `/supabase/schema.sql` di SQL Editor Supabase Anda.
3. Aktifkan **Google Auth** di menu Authentication jika ingin menggunakan login Google.
4. Buat bucket baru bernama `sapi-photos` di menu Storage (beri akses Public Read).

### 2. Environment Variables
Salin konten dari `.env.example` ke file `.env` dan isi dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Jalankan Aplikasi
```bash
npm install
npm run dev
```

## Struktur Folder

- `src/app/`: Root application logic.
- `src/components/layout/`: Komponen layout (Sidebar, Header, MobileNav).
- `src/components/ui/`: Komponen UI (shadcn).
- `src/pages/`: Halaman aplikasi.
- `src/lib/`: Utilitas dan konfigurasi (Supabase, utils).
- `src/store/`: State management (Zustand).
- `supabase/`: Schema database.
- `server.ts`: Entry point server Express.
