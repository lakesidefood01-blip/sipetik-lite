import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function BillingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 space-y-6 text-center">
      <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-8 border-emerald-50">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">Pembayaran Berhasil!</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Terima kasih, pembayaran Anda telah kami terima. Paket SIPETIK Pro Anda sekarang sudah aktif.
      </p>
      
      <div className="pt-6">
        <Button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-8 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-md font-bold shadow-lg shadow-emerald-500/20">
          Masuk ke Dashboard
        </Button>
      </div>
    </div>
  );
}
