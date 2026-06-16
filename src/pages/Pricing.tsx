import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/src/store/useAppStore';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Check, X, ShieldCheck, Zap } from 'lucide-react';
import { isActiveProPlan } from '@/src/lib/subscription';
import { supabase } from '@/src/lib/supabase';

export default function Pricing() {
  const navigate = useNavigate();
  const { user, profile } = useAppStore();
  const [loading, setLoading] = useState(false);
  const isPro = isActiveProPlan(profile);

  useEffect(() => {
    document.title = 'Harga Langganan | SIPETIK Lite';
    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', 'Upgrade paket SIPETIK Lite Anda ke Pro untuk mendapatkan fitur tanpa batas pengelolaan peternakan sapi Anda.');
    setMetaTag('og:title', 'Pricing - SIPETIK Lite Pro');
    setMetaTag('og:description', 'Upgrade paket SIPETIK Lite Anda ke Pro untuk mendapatkan fitur tanpa batas.');
    setMetaTag('twitter:card', 'summary_large_image');
    
    // Canonical
    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/pricing');
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      // Karena aplikasi dihosting static (Static Site Generation / SPA),
      // kita alihkan langsung ke URL pembayaran Mayar (Static Link).
      // Pastikan untuk mengganti VITE_MAYAR_PAYMENT_URL di .env dengan URL produk Mayar asli Anda.
      const mayarPaymentUrl = import.meta.env.VITE_MAYAR_PAYMENT_URL || 'https://rizal-hakim.mayar.shop/m/sipetik';
      
      // Tambahkan referensi user.id agar webhook nanti tahu ini pembayaran siapa.
      // Format parameter bisa disesuaikan dengan dokumentasi Mayar (misalnya ?ref= atau ?custom_field=)
      const finalUrl = `${mayarPaymentUrl}?ref=${user.id}`;
      
      window.location.href = finalUrl;
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan saat mengarahkan ke halaman pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Pricing</h2>
        <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Pilih Paket Sesuai Skala Peternakan Anda</p>
        <p className="text-lg text-slate-500">Mulai secara gratis dan tingkatkan ke versi Pro saat peternakan Anda semakin berkembang pesat.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        {/* Free Plan */}
        <Card className="border shadow-none hover:shadow-md transition-shadow relative">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Paket Gratis</CardTitle>
            <CardDescription>Untuk peternak pemula</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline">
              <span className="text-5xl font-extrabold tracking-tight">Rp 0</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/bulan</span>
            </div>
            <ul className="space-y-3 pt-4">
              {[
                { text: 'Maksimal 3 ekor sapi', included: true },
                { text: 'Catatan pemberian pakan', included: true },
                { text: 'Pencatatan keuangan dasar', included: true },
                { text: 'Riwayat berat badan', included: true },
                { text: 'Unlimited sapi', included: false },
                { text: 'Cetak Laporan PDF Eksekutif', included: false },
                { text: 'Dashboard & Analitik Premium', included: false },
                { text: 'Pengingat otomatis', included: false }
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  {feature.included ? (
                    <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="bg-slate-100 p-1 rounded-full text-slate-400">
                      <X className="h-4 w-4" />
                    </div>
                  )}
                  <span className={feature.included ? "text-slate-700" : "text-slate-500"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-slate-600" 
              disabled={isPro}
              onClick={() => navigate('/dashboard')}
            >
              {isPro ? 'Bukan Paket Saat Ini' : 'Paket Anda Saat Ini'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-emerald-500 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 py-1.5 px-3 bg-emerald-500 text-white text-xs font-bold rounded-bl-lg uppercase tracking-wider">
            Rekomendasi
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-6 w-6 text-emerald-500" />
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">Paket Pro</CardTitle>
            </div>
            <CardDescription>Untuk peternakan komersial profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline">
              <span className="text-5xl font-extrabold tracking-tight">Rp 49.000</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/bulan</span>
            </div>
            <ul className="space-y-3 pt-4">
              {[
                { text: 'Kelola ratusan sapi tanpa batas', included: true },
                { text: 'Catatan pakan komprehensif', included: true },
                { text: 'Laporan margin untung/rugi detail', included: true },
                { text: 'Kalkulasi ADG Otomatis', included: true },
                { text: 'Cetak Laporan PDF Eksekutif', included: true },
                { text: 'Dashboard & Analitik Premium', included: true },
                { text: 'Pengingat kesehatan terotomatisasi', included: true }
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-slate-800 font-medium">{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-md shadow-lg shadow-emerald-500/30" 
              onClick={handleUpgrade}
              disabled={isPro || loading}
            >
              {loading ? "Memproses..." : isPro ? 'Paket Aktif Saat Ini' : 'Berlangganan Sekarang'}
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}
