import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Beef, Loader2, ArrowLeft, ShieldCheck, HeartPulse, Scale, Utensils, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Password tidak cocok.');
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nama,
          }
        }
      });

      if (error) throw error;
      
      toast.success('Pendaftaran Berhasil! Silakan cek email Anda untuk verifikasi atau silakan masuk.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Gagal login dengan Google.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* LEFT SIDE PANEL - ILLUSTRATION/BENEFITS FOR DESKTOP */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-emerald-900 via-emerald-800 to-teal-850 relative p-12 flex-col justify-between text-white overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/30 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back Button / Brand Logo */}
        <div className="flex items-center justify-between relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-white border border-white/10">
              <Beef className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">SIPETIK<span className="font-light text-base text-emerald-300">Lite</span></span>
          </div>
        </div>

        {/* Dynamic promotional lists */}
        <div className="space-y-8 relative z-10 my-auto max-w-lg">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight">Mulai Melangkah Lebih Maju Bersama SIPETIK Lite</h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Daftarkan sekarang dan nikmati integrasi penuh pencatatan data peternakan secara instan gratis tanpa biaya langganan berbelit.
            </p>
          </div>

          {/* Benefits Bulletpoints */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex gap-3 items-start">
              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 border border-white/10 shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Mudah Digunakan Kapan Saja</h4>
                <p className="text-xs text-emerald-250 leading-relaxed mt-0.5">Simpan, sunting, dan pantau data populasi sapi langsung di genggaman Anda dari kandang.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 border border-white/10 shrink-0 mt-0.5">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Data Keuangan & Pakan Sinkron</h4>
                <p className="text-xs text-emerald-250 leading-relaxed mt-0.5">Pantau rasio untung laba dan biaya pakan mingguan Anda otomatis tanpa manual hitung di kalkulator.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-white/50 relative z-10">
          © 2026 SIPETIK Lite. Professional Livestock Management.
        </div>
      </div>

      {/* RIGHT SIDE PANEL - REGISTER FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo and Greeting */}
          <div className="space-y-1">
            <Link to="/" className="inline-flex lg:hidden items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-2">
              <ArrowLeft className="h-3 w-3" /> Kembali ke awal
            </Link>
            <div className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg mb-3">
              <Beef className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">Buat Akun Baru</h1>
            <p className="text-slate-500 text-sm">Silakan isi formulir di bawah ini untuk memulai registrasi peternakan Anda.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="nama" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap</Label>
              <Input 
                id="nama" 
                type="text" 
                placeholder="Budi Santoso" 
                required 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={loading}
                className="h-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Alamat Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nama@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Kata Sandi</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ulangi Sandi</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="h-10 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-emerald-600/10 mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Daftar Akun Baru"
              )}
            </Button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">Atau masuk dengan</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <Button variant="outline" className="w-full h-10 border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 p-0 font-semibold text-slate-700" onClick={handleGoogleLogin}>
            <div className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.16-3.16C17.47 1.8 14.94 1 12 1 7.24 1 3.24 3.76 1.34 7.78l3.72 2.88C5.93 7.37 8.74 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.49z"
                />
                <path
                  fill="#34A853"
                  d="M5.06 13.34a7.137 7.137 0 0 1 0-2.68L1.34 7.78C.49 9.5 0 11.19 0 12s.49 2.5 1.34 4.22l3.72-2.88z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 18.96c-3.26 0-6.07-2.33-7.06-5.62l-3.72 2.88c1.9 4.02 5.9 6.78 10.66 6.78 2.94 0 5.64-.97 7.63-2.65l-3.65-2.83c-1.11.75-2.5 1.32-3.86 1.32z"
                />
              </svg>
              <span>Google Account</span>
            </div>
          </Button>

          <p className="text-center text-sm text-slate-500">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Masuk Sekarang
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}
