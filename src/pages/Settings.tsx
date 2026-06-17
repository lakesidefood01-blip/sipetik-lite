import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { User, Shield, Bell, Moon, LogOut, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, profile: storeProfile, setProfile: setStoreProfile, theme, setTheme } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: user?.email || '',
    fullName: '',
  });
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Ambil full_name dari Supabase saat halaman dibuka
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setFetchingProfile(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile({
            email: data.email || user.email || '',
            fullName: data.full_name || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Sesi tidak ditemukan, silakan login ulang.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profile.fullName })
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        toast.error('Gagal memperbarui profil.');
        return;
      }

      // Sync ke global store agar nama langsung update di seluruh app (misal navbar)
      if (storeProfile) {
        setStoreProfile({ ...storeProfile, full_name: profile.fullName });
      }

      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password berhasil diperbarui');
        setPasswords({ newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengubah password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola akun dan preferensi aplikasi Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profil Akun</CardTitle>
            </div>
            <CardDescription>Informasi pribadi peternak.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
                <p className="text-[10px] text-muted-foreground italic">Email tidak dapat diubah.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  placeholder="Nama Lengkap Anda"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  disabled={fetchingProfile}
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading || fetchingProfile}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Keamanan</CardTitle>
            </div>
            <CardDescription>Ubah kata sandi akun Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                 <Label>Password Baru</Label>
                 <Input 
                   type="password" 
                   value={passwords.newPassword}
                   onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                   disabled={passwordLoading}
                 />
              </div>
              <div className="space-y-2">
                 <Label>Konfirmasi Password</Label>
                 <Input 
                   type="password" 
                   value={passwords.confirmPassword}
                   onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                   disabled={passwordLoading}
                 />
              </div>
              <Button type="submit" variant="outline" className="w-full gap-2" disabled={passwordLoading}>
                {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Ubah Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifikasi</CardTitle>
            </div>
            <CardDescription>Atur pengingat kesehatan dan laporan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm">Email Recap Mingguan</p>
                    <p className="text-xs text-muted-foreground">Terima ringkasan data sapi setiap minggu.</p>
                </div>
                <div className="h-6 w-10 rounded-full bg-primary relative"><div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div></div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
                <div>
                    <p className="font-medium text-sm">Notifikasi Web</p>
                    <p className="text-xs text-muted-foreground">Dapatkan pemberitahuan di browser.</p>
                </div>
                <div className="h-6 w-10 rounded-full bg-muted relative"><div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white"></div></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              <CardTitle>Tampilan</CardTitle>
            </div>
            <CardDescription>Personalisasi antarmuka aplikasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-sm">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Gunakan tema gelap saat malam hari.</p>
                </div>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`h-6 w-10 min-w-10 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-muted border border-border/50'}`}
                >
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all shadow-sm ${theme === 'dark' ? 'left-5' : 'left-1'}`}></div>
                </button>
            </div>
          </CardContent>
          <CardFooter className="pt-6 border-t mt-4 flex justify-between items-center text-xs text-muted-foreground">
             <p>SIPETIK Lite Version 1.0.0 (Stable)</p>
             <Button variant="ghost" size="sm" className="text-red-500 gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Keluar
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}