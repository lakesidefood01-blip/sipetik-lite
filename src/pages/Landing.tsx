import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beef, 
  TrendingUp, 
  Wallet, 
  Scale, 
  Utensils, 
  HeartPulse, 
  Check, 
  Menu, 
  X, 
  ArrowRight, 
  Play, 
  Award, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  TrendingDown,
  Activity,
  Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/src/store/useAppStore';
import { Button } from '@/src/components/ui/button';

export default function Landing() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'dashboard' | 'sapi' | 'pakan' | 'keuangan'>('dashboard');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      title: "Mudah Digunakan",
      description: "Antarmuka yang dirancang khusus untuk peternak di lapangan, mudah dioperasikan langsung dari HP Anda.",
      icon: Smartphone,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Data Lebih Rapi",
      description: "Tinggalkan folder kertas basah atau hilang. Semua data sapi Anda tersimpan aman dan teratur.",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Pantau Biaya Pakan",
      description: "Kalkulasi otomatis biaya pakan bulanan secara akurat untuk meminimalisir pengeluaran berlebih.",
      icon: Utensils,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "Pantau Berat Sapi",
      description: "Grafik pertumbuhan yang menunjukkan Average Daily Gain (ADG) untuk memastikan sapi tumbuh optimal.",
      icon: Scale,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const features = [
    {
      title: "Data Sapi Terpusat",
      description: "Catat ras, tanggal beli, harga awal, umur, status indukan, hingga unggah foto sapi langsung.",
      icon: Beef
    },
    {
      title: "Manajemen Pakan Harian",
      description: "Monitor konsumsi pakan harian lengkap dengan harga pakan untuk melacak efisiensi gizi.",
      icon: Utensils
    },
    {
      title: "Pencatatan Keuangan",
      description: "Arus kas pendapatan dan pengeluaran operasional terdata otomatis per transaksi secara mendalam.",
      icon: Wallet
    },
    {
      title: "Riwayat Berat & ADG",
      description: "Pantau kenaikan berat badan sapi dari waktu ke waktu secara periodik dengan grafik visual.",
      icon: Scale
    },
    {
      title: "Reminders Kesehatan",
      description: "Sistem jadwal berkala untuk vaksin, obat cacing, vitamin, atau kunjungan dokter hewan.",
      icon: HeartPulse
    },
    {
      title: "Laporan & Statistik",
      description: "Dapatkan analisis grafik performa ternak, estimasi laba kotor, dan total nilai populasi Anda.",
      icon: TrendingUp
    }
  ];

  const whyPoints = [
    "Sangat hemat waktu dibanding mencatat manual di buku",
    "Data aman di cloud, catatan tidak akan luntur atau hilang",
    "Semua informasi penting peternakan ada di genggaman HP",
    "Didesain ramah untuk peternak kecil hingga skala menengah",
    "Dapat diakses di mana saja dan kapan saja secara real-time"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Beef className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                SIPETIK<span className="text-slate-900 font-light text-lg">Lite</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
              <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition-colors cursor-pointer">Fitur</button>
              <button onClick={() => scrollToSection('why-us')} className="hover:text-emerald-600 transition-colors cursor-pointer">Keunggulan</button>
              <button onClick={() => scrollToSection('preview')} className="hover:text-emerald-600 transition-colors cursor-pointer">Demo Aplikasi</button>
            </div>

            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Button onClick={() => navigate('/dashboard')} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/15 font-semibold text-sm h-10 px-5">
                  Masuk Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-xl text-sm font-semibold h-10 px-4">
                    Masuk
                  </Button>
                  <Button onClick={() => navigate('/register')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/15 font-semibold text-sm h-10 px-5">
                    Daftar Sekarang
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-emerald-600 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="block w-full text-left py-2 text-slate-600 hover:text-emerald-600 font-medium border-b border-slate-50"
                >
                  Fitur
                </button>
                <button 
                  onClick={() => scrollToSection('why-us')} 
                  className="block w-full text-left py-2 text-slate-600 hover:text-emerald-600 font-medium border-b border-slate-50"
                >
                  Keunggulan
                </button>
                <button 
                  onClick={() => scrollToSection('preview')} 
                  className="block w-full text-left py-2 text-slate-600 hover:text-emerald-600 font-medium border-b border-slate-50"
                >
                  Demo Aplikasi
                </button>
                <div className="pt-4 flex flex-col gap-2">
                  {user ? (
                    <Button onClick={() => navigate('/dashboard')} className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold">
                      Masuk Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => navigate('/login')} className="w-full justify-center border-slate-200 rounded-xl py-3 font-semibold">
                        Masuk
                      </Button>
                      <Button onClick={() => navigate('/register')} className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold">
                        Daftar Gratis
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50 overflow-hidden">
        {/* Subtle decorative background patterns */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -mr-72 -mt-32"></div>
        <div className="absolute top-1/2 left-0 w-[30rem] h-[30rem] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none -ml-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Col: Headline + Info */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              >
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SaaS Peternakan Modern Indonesia 🐄
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
              >
                Kelola Ternak Lebih <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Mudah</span>,<br />
                Untung Makin <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Bertambah</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                SIPETIK membantu peternak mencatat pakan harian, mengelola keuangan, mengawasi kesehatan, dan memonitor laju pertambahan berat sapi dalam satu sistem yang sangat praktis.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button 
                  onClick={() => navigate(user ? '/dashboard' : '/register')} 
                  className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/25 transition-all hover:translate-y-[-2px] active:translate-y-0"
                >
                  {user ? "Masuk Dashboard" : "Mulai Gratis Sekarang"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => scrollToSection('preview')} 
                  className="h-14 px-8 rounded-2xl border-slate-200 text-slate-800 font-bold text-base bg-white hover:bg-slate-50 hover:border-slate-300 transition-all hover:translate-y-[-2px] active:translate-y-0 gap-2"
                >
                  <Play className="h-4 w-4 text-emerald-600 fill-emerald-600" /> Lihat Demo UI
                </Button>
              </motion.div>

              {/* Mini Social proof of active growth */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <span>Sistem Database Supabase Terintegrasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>Keamanan Data Terenkripsi</span>
                </div>
              </motion.div>
            </div>

            {/* Right Col: High quality SPA interactive visual mock */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Outer decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-sky-300 rounded-3xl blur-2xl opacity-10 -rotate-3 scale-95 pointer-events-none"></div>
              
              {/* Phone Frame container mock */}
              <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] bg-slate-900 rounded-[40px] p-3 shadow-2xl shadow-slate-900/30 border-4 border-slate-800">
                {/* Speaker pill */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
                </div>

                {/* Simulated Screen */}
                <div className="relative bg-slate-50 rounded-[32px] overflow-hidden aspect-[9/19] flex flex-col pt-6 font-sans">
                  {/* Mock Nav Bar */}
                  <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center text-[10px] text-white">🐄</div>
                      <span className="font-extrabold text-[11px] tracking-tight text-slate-800">SIPETIK</span>
                    </div>
                    <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-600">👤</div>
                  </div>

                  {/* App Dashboard Screen */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3 text-[11px]">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-400 text-[9px]">Selamat Datang,</p>
                      <p className="font-bold text-slate-800 text-sm">Peternak Makmur 🚀</p>
                    </div>

                    {/* Quick overview metric cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm space-y-1">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Total Sapi</span>
                          <Beef className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <p className="text-sm font-extrabold text-slate-800">14 Ekor</p>
                        <p className="text-[8px] text-emerald-600 font-medium">● Sehat semua</p>
                      </div>
                      <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl p-2.5 shadow-sm space-y-1">
                        <div className="flex justify-between items-center opacity-80">
                          <span>Bulanan ADG</span>
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-sm font-extrabold">+1.4 kg</p>
                        <p className="text-[8px] text-emerald-100 font-medium">Harian/Ekor</p>
                      </div>
                    </div>

                    {/* Static Visual growth chart preview */}
                    <div className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">Tren Pertumbuhan</span>
                        <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1 rounded font-semibold">+12%</span>
                      </div>
                      {/* Fake mini visual graph */}
                      <div className="h-16 flex items-end justify-between px-1 pt-2">
                        {[20, 35, 30, 45, 55, 50, 75].map((val, idx) => (
                          <div key={idx} className="w-4 rounded-t bg-slate-100 relative group flex items-end justify-center" style={{ height: '100%' }}>
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${val}%` }}
                              transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                              className="w-full rounded-t bg-emerald-500 hover:bg-emerald-600 transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sapi Items */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">Sapi Unggulan</span>
                        <span className="text-[9px] text-slate-400">Semua (14)</span>
                      </div>
                      <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[8px]">SP01</div>
                          <div>
                            <p className="font-bold text-slate-800">Limosin Super</p>
                            <p className="text-[8px] text-slate-400">Timbangan terakhir: 620kg</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-emerald-600 font-bold">+1.8 kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating micro stat-card 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-12 -left-8 sm:-left-12 bg-white rounded-2xl p-3.5 shadow-xl shadow-slate-900/5 border border-slate-100 flex items-center gap-3.5"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Feed Expenses</p>
                  <p className="text-sm font-extrabold text-slate-800">Rp 120.000 /hr</p>
                </div>
              </motion.div>

              {/* Floating micro stat-card 2 */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "easeInOut" }}
                className="absolute bottom-16 -right-6 sm:-right-10 bg-white rounded-2xl p-3.5 shadow-xl shadow-slate-900/5 border border-slate-100 flex items-center gap-3.5"
              >
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kesehatan Sapi</p>
                  <p className="text-sm font-extrabold text-slate-800">Tepat Waktu ✓</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Keuntungan SIPETIK</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Efisien, Cerdas & Menguntungkan</p>
            <p className="text-slate-500">Membantu peternakan beralih dari pencatatan tradisional yang berisiko berantakan ke sistem digital yang rapi dan terukur.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div 
                  key={idx}
                  className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-xl hover:shadow-slate-100 duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${b.color} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-50 relative scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Fitur Unggulan</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Semua Fitur Manajemen yang Anda Butuhkan</p>
            <p className="text-slate-500">Kami membuat peternakan modern menjadi sederhana dengan menyediakan solusi penuh dalam satu genggaman tangan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => {
              const IconComp = f.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-emerald-500/20 shadow-sm hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Accent hover decoration line */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>

                  <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* APP PREVIEW SECTION WITH TABS */}
      <section id="preview" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Demo Antarmuka</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Lihat Cara Kerja SIPETIK Lite</p>
            <p className="text-slate-500">Berikut adalah screenshoot rancangan modul UI aplikasi modern kami yang dirancang responsive untuk layar browser ataupun mobile.</p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-12">
            {[
              { id: 'dashboard', label: 'Dashboard Utama' },
              { id: 'sapi', label: 'Manajemen Sapi' },
              { id: 'pakan', label: 'Pemberian Pakan' },
              { id: 'keuangan', label: 'Arus Kas' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setPreviewTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  previewTab === tab.id 
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive responsive template frame */}
          <div className="bg-slate-950 rounded-2xl md:rounded-[32px] p-4 md:p-8 shadow-2xl border border-slate-900 max-w-5xl mx-auto overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-4">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-500 font-mono ml-4">https://sipetik-lite/app/{previewTab}</span>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden min-h-[400px]">
              <AnimatePresence mode="wait">
                {previewTab === 'dashboard' && (
                  <motion.div 
                    key="tab-dashboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 space-y-6 text-slate-100"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-white">Dashboard Monitoring 📊</h4>
                        <p className="text-xs text-slate-400">Ringkasan kondisi peternakan saat ini.</p>
                      </div>
                      <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400">21 Mei 2026</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Total Sapi", value: "14 Ekor", trend: "Populasi aktif", color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
                        { label: "Biaya Pakan Harian", value: "Rp 120.000", trend: "+2.5% vs bln lalu", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
                        { label: "Arus Kas Bulanan", value: "+Rp 14.200.000", trend: "Laba bersih", color: "border-teal-500/20 bg-teal-500/5 text-teal-400" },
                        { label: "Vaksin / Vitamin", value: "3 Jadwal", trend: "Jadwal terdekat", color: "border-rose-500/20 bg-rose-500/5 text-rose-400" }
                      ].map((item, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${item.color}`}>
                          <p className="text-[10px] uppercase font-bold opacity-70">{item.label}</p>
                          <p className="text-xl font-black mt-1">{item.value}</p>
                          <p className="text-[10px] mt-2 opacity-80">{item.trend}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Growth Trend chart simulation */}
                      <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-white">Grafik Pertumbuhan Berat Sapi</span>
                          <span className="text-xs text-emerald-400">Average Gaining Rerata</span>
                        </div>
                        <div className="h-44 w-full flex items-end justify-between px-2 pt-4 border-l border-b border-slate-800">
                          {[30, 45, 60, 55, 70, 85, 95].map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[8px] text-slate-500">{val * 5}kg</span>
                              <div className="w-4/5 rounded bg-emerald-500/10 h-32 flex items-end">
                                <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${val}%` }}></div>
                              </div>
                              <span className="text-[8px] text-slate-500">M-{idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Health schedule widget simulation */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                        <span className="font-bold text-sm text-white block">Jadwal Agenda Kesehatan</span>
                        <div className="space-y-2.5">
                          {[
                            { label: "Vaksinasi PMK", sapi: "Sapi Bali SP-03", state: "Mendesak", bg: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
                            { label: "Pemberian Vitamin B12", sapi: "Sapi Brahman SP-08", state: "Besok", bg: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
                            { label: "Timbang Rutin Bulanan", sapi: "Semua Sapi", state: "24 Mei", bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" }
                          ].map((agenda, i) => (
                            <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${agenda.bg}`}>
                              <div>
                                <p className="font-bold text-xs text-white">{agenda.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{agenda.sapi}</p>
                              </div>
                              <span className="text-[9px] font-bold uppercase">{agenda.state}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewTab === 'sapi' && (
                  <motion.div 
                    key="tab-sapi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 space-y-6 text-slate-100"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-white">Manajemen Database Sapi 🐂</h4>
                        <p className="text-xs text-slate-400">Total populasi yang terintegrasi di peternakan.</p>
                      </div>
                      <Button variant="outline" className="gap-2 bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-xl">
                        <Plus className="h-4 w-4" /> Tambah Sapi Baru
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "S-01", nama: "Limosin Super", ras: "Limousin", berat: "620 kg", status: "Sehat", date: "Jan 12, 2026", color: "text-emerald-400 bg-emerald-500/10" },
                        { id: "S-02", nama: "Brahman Cross", ras: "Brahman", berat: "580 kg", status: "Sehat", date: "Feb 10, 2026", color: "text-emerald-400 bg-emerald-500/10" },
                        { id: "S-03", nama: "Sapi Bali Jantan", ras: "Bali", berat: "410 kg", status: "Penyembuhan", date: "Mar 05, 2026", color: "text-amber-400 bg-amber-500/10" },
                        { id: "S-04", nama: "Simmental Indah", ras: "Simmental", berat: "640 kg", status: "Sehat", date: "Apr 01, 2026", color: "text-emerald-400 bg-emerald-500/10" }
                      ].map((s, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center group hover:border-slate-700 transition-all duration-200">
                          <div className="flex gap-3">
                            <div className="h-11 w-11 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                              #{s.id}
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-white">{s.nama}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{s.ras} | Belinya {s.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-200">{s.berat}</p>
                            <span className={`inline-block py-0.5 px-2 rounded-full text-[9px] font-bold uppercase mt-1 ${s.color}`}>{s.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {previewTab === 'pakan' && (
                  <motion.div 
                    key="tab-pakan"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 space-y-6 text-slate-100"
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-white">Log Pemberian Pakan Harian 🥦</h4>
                        <p className="text-xs text-slate-400">Kelola ransum, nutrisi, dan kalkulasi pengeluaran pakan harian sapi.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 lg:col-span-1">
                        <span className="font-bold text-slate-200 text-sm block border-b border-slate-800 pb-2">Ransum Hari Ini</span>
                        <div className="space-y-3">
                          {[
                            { label: "Konsentrat Hijau", berat: "120 kg", cost: "Rp 360.000", brand: "SusuIndo" },
                            { label: "Jerami Fermentasi", berat: "300 kg", cost: "Rp 150.000", brand: "Lokal" },
                            { label: "Silase Jagung", berat: "150 kg", cost: "Rp 450.000", brand: "UnggulFeed" }
                          ].map((item, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between text-xs">
                              <div>
                                <p className="font-bold text-white">{item.label}</p>
                                <p className="text-[10px] text-slate-500 mt-1">{item.brand}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-emerald-400">{item.cost}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{item.berat}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 lg:col-span-2">
                        <span className="font-bold text-slate-200 text-sm block border-b border-slate-800 pb-2">Penghematan Biaya & Efisiensi Pakan (FCR)</span>
                        <div className="h-44 flex items-end justify-between px-2 pt-2 border-l border-b border-slate-800 ml-4 font-mono text-[9px] text-slate-400">
                          {/* Simulated FCR ratio bar chart */}
                          {[
                            { name: "Minggu 1", cost: 1200000, color: "bg-emerald-600" },
                            { name: "Minggu 2", cost: 1050000, color: "bg-emerald-500" },
                            { name: "Minggu 3", cost: 950000, color: "bg-emerald-400" },
                            { name: "Minggu 4", cost: 890000, color: "bg-emerald-300" }
                          ].map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <span>Rp {(bar.cost / 1000).toLocaleString('id-ID')}k</span>
                              <div className="w-12 bg-slate-900 h-28 flex items-end rounded-t overflow-hidden border border-slate-800">
                                <div className={`w-full ${bar.color}`} style={{ height: `${(bar.cost / 1300000) * 100}%` }}></div>
                              </div>
                              <span>{bar.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewTab === 'keuangan' && (
                  <motion.div 
                    key="tab-keuangan"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 space-y-6 text-slate-100"
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-white">Laporan Keuangan & Rugi Laba 💰</h4>
                        <p className="text-xs text-slate-400">Pencatatan kas otomatis untuk melacak margin laba Anda.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Pemasukan Hari Ini</span>
                        <p className="text-2xl font-black mt-2 text-white">Rp 24.500.000</p>
                        <p className="text-[10px] text-emerald-300 mt-2">Penjualan 1 Sapi Limousin #01</p>
                      </div>
                      <div className="p-4 bg-rose-950/40 border border-rose-500/20 rounded-xl">
                        <span className="text-[10px] text-rose-400 font-bold uppercase block">Pengeluaran Hari Ini</span>
                        <p className="text-2xl font-black mt-2 text-white">Rp 4.200.000</p>
                        <p className="text-[10px] text-rose-300 mt-2">Pembelian Ransum & Sewa Konsultasi Vet</p>
                      </div>
                      <div className="p-4 bg-teal-950/40 border border-teal-500/20 rounded-xl md:col-span-2 lg:col-span-1">
                        <span className="text-[10px] text-teal-400 font-bold uppercase block">Estimasi Profit Margins</span>
                        <p className="text-2xl font-black mt-2 text-white">+ Rp 20.300.000</p>
                        <p className="text-[10px] text-teal-300 mt-2">Sehat & Berkelanjutan</p>
                      </div>
                    </div>

                    {/* Fake list of transactions */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 font-bold text-xs text-slate-300">Aktivitas Transaksi Finansial Terkini</div>
                      <div className="divide-y divide-slate-900">
                        {[
                          { title: "Penjualan Sapi Limousin SP-01", desc: "Hasil penggemukan 6 bulan", value: "+ Rp 24.500.000", type: "in" },
                          { title: "Pembelian Konsentrat Premium (SusuIndo)", desc: "10 karung ransum gizi", value: "- Rp 3.200.000", type: "out" },
                          { title: "Biaya Vaksin PKM & Konsultasi Vet", desc: "Preventive care kesehatan", value: "- Rp 1.000.000", type: "out" }
                        ].map((t, idx) => (
                          <div key={idx} className="p-4 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-extrabold text-white">{t.title}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                            </div>
                            <span className={`font-black ${t.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {t.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* WHY SIPETIK SECTION */}
      <section id="why-us" className="py-24 bg-slate-900 text-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Info */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Keunggulan Utama</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Mengapa Harus Menggunakan SIPETIK Lite?</h2>
              <p className="text-slate-400 leading-relaxed">
                Kami memahami kebutuhan para peternak lokalan Indonesia. SIPETIK hadir sebagai asisten digital peternakan yang siap sedia membantu memonitor populasi sapi mulai dari penimbangan berat hingga mencatat pengeluaran keuangan tanpa perlu ribet.
              </p>

              {/* Checklists with icons */}
              <div className="space-y-4 pt-4">
                {whyPoints.map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-slate-300 font-medium text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: High quality aesthetic promotional card/bento */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/20 transition-all duration-300">
                <span className="text-xs font-bold text-slate-400">01 / MOBILITAS</span>
                <h4 className="font-black text-lg text-white">Bisa Dipakai di Lapangan</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Dirancang ringan dan responsif, sangat pas untuk diisi langsung saat sedang di kandang melalui smartphone.</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/20 transition-all duration-300 translate-y-6">
                <span className="text-xs font-bold text-slate-400">02 / INTERKONEKSI</span>
                <h4 className="font-black text-lg text-white">Full Database Realtime</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Terhubung secara kokoh dengan backend Supabase Database agar data sinkron seketika di semua perangkat Anda.</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/20 transition-all duration-300">
                <span className="text-xs font-bold text-slate-400">03 / ANALITIK</span>
                <h4 className="font-black text-lg text-white">Laporan Ekspor Otomatis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Pantau grafik ADG harian, total margin keuntungan, dan evaluasi operasional pakan bulanan secara teratur.</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/20 transition-all duration-300 translate-y-6">
                <span className="text-xs font-bold text-slate-400">04 / INTERFACES</span>
                <h4 className="font-black text-lg text-white">UI Modern & Bersih</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Tema elegan modern bernuansa segar yang nyaman dibaca berlama-lama tanpa membuat mata cepat lelah.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative bg-gradient-to-tr from-emerald-800 to-emerald-600 rounded-[32px] p-8 md:p-16 text-center text-white overflow-hidden shadow-2xl shadow-emerald-700/20">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/30 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative max-w-3xl mx-auto space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest bg-emerald-900/50 px-3.5 py-1.5 rounded-full inline-block">Mulai Sekarang</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">Mulai Kelola Peternakan dengan Lebih Modern</h2>
              <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Bergabunglah bersama ratusan peternak progresif lainnya. Semua data, catatan keuangan, pematauan berat badan, obat-obatan, dan pakan sapi dalam satu aplikasi praktis dikoordinir dengan rapi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                {user ? (
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    className="h-14 px-8 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-base shadow-xl transition-all hover:translate-y-[-2px]"
                  >
                    Masuk ke Dashboard Saya
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="h-14 px-8 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-base shadow-xl transition-all hover:translate-y-[-2px]"
                    >
                      Daftar Akun Sekarang
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/login')} 
                      className="h-14 px-8 rounded-2xl border-white/20 text-white bg-transparent hover:bg-white/10 hover:border-white/40 transition-all hover:translate-y-[-2px]"
                    >
                      Masuk ke Akun
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <Beef className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  SIPETIK<span className="text-emerald-500 font-light text-lg">Lite</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Aplikasi manajemen peternakan sapi untuk mencatat pakan harian, mengawasi kesehatan, dan meneliti berat sapi secara terintegrasi dan informatif.
              </p>
            </div>

            <div>
              <span className="font-bold text-xs text-slate-300 uppercase block tracking-widest mb-4">Akses Navigasi</span>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Fitur SIPETIK</button></li>
                <li><button onClick={() => scrollToSection('why-us')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Keunggulan Sistem</button></li>
                <li><button onClick={() => scrollToSection('preview')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">Visual Demo</button></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors block text-left">Halaman Masuk</Link></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-xs text-slate-300 uppercase block tracking-widest mb-4">Kontak & Info</span>
              <ul className="space-y-2.5 text-sm">
                <li><span className="block text-slate-400"><strong>Email:</strong> support@sipetik-lite.my.id</span></li>
                <li><span className="block text-slate-400"><strong>No Telp:</strong> 082127753082</span></li>
                <li><span className="block text-slate-400"><strong>Alamat:</strong> Jln. Semeru no 15A Kel. Magetan, Kec. Magetan, Kab. Magetan, Jawa Timur 63319</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-slate-500">© 2026 SIPETIK Lite. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex gap-6 text-slate-500">
              <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
