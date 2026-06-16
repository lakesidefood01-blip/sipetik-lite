import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function BillingFailed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 space-y-6 text-center">
      <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4 border-8 border-red-50">
        <XCircle className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">Pembayaran Gagal</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Maaf, terjadi kesalahan atau pembayaran Anda dibatalkan. Silakan coba lagi atau beritahu kami jika Anda membutuhkan bantuan.
      </p>
      
      <div className="pt-6 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/pricing')} className="px-8 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-md font-bold shadow-lg">
          Coba Lagi
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="px-8 h-12 rounded-xl gap-2 text-slate-600">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
