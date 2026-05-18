import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Beef, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
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
      });

      if (error) throw error;
      
      toast.success('Pendaftaran Berhasil! Silakan cek email Anda untuk verifikasi.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-4">
            <Beef className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">SIPETIK<span className="text-foreground/60">Lite</span></h1>
          <p className="mt-2 text-muted-foreground">Mulai manajemen peternakan Anda hari ini.</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Daftar Akun</CardTitle>
            <CardDescription>Buat akun baru untuk mulai mencatat.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Daftar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2">
            <div className="text-sm text-muted-foreground">Sudah punya akun?</div>
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">Masuk</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
