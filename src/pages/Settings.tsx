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
  const { user } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: user?.email || '',
    fullName: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, you'd update the profiles table
    setTimeout(() => {
      setLoading(false);
      toast.success('Profil berhasil diperbarui!');
    }, 1000);
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
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
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
            <CardDescription>Ubah kata sandi dan autentikasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Password Saat Ini</Label>
                <Input type="password" />
             </div>
             <div className="space-y-2">
                <Label>Password Baru</Label>
                <Input type="password" />
             </div>
             <Button variant="outline" className="w-full">Ubah Password</Button>
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
                <div className="h-6 w-10 rounded-full bg-muted relative"><div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white"></div></div>
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
