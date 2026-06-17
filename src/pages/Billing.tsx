import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/src/store/useAppStore';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { isActiveProPlan } from '@/src/lib/subscription';
import { Badge } from '@/src/components/ui/badge';
import { Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface PaymentHistory {
  id: string;
  reference_id: string;
  amount: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

export default function Billing() {
  const { profile, user } = useAppStore();
  const navigate = useNavigate();
  const isPro = isActiveProPlan(profile);

  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    document.title = 'Langganan & Tagihan | SIPETIK Lite';
    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', 'Kelola paket langganan dan integrasi pembayaran SIPETIK Lite Anda.');
    setMetaTag('og:title', 'Billing - SIPETIK Lite');
    setMetaTag('twitter:card', 'summary');

    let canonical = document.querySelector(`link[rel="canonical"]`);
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + '/billing');
  }, []);

  // Fetch riwayat pembayaran dari Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) {
        setLoadingPayments(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('membership_payments')
          .select('id, reference_id, amount, period_start, period_end, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPayments(data);
        }
      } catch (err) {
        console.error('Failed to fetch payment history', err);
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [user]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tagihan & Berlangganan</h1>
        <p className="text-muted-foreground">Kelola paket langganan dan integrasi pembayaran Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card className="border-none shadow-sm overflow-hidden relative">
          {isPro && (
            <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-500 text-white text-[10px] font-bold rounded-bl-lg uppercase tracking-wider">
              Active
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              Status Paket
            </CardTitle>
            <CardDescription>
              Informasi paket langganan SIPETIK Anda saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Current Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl font-black">{isPro ? 'PRO PLAN' : 'FREE PLAN'}</h3>
                  {isPro && <ShieldCheck className="h-5 w-5 text-emerald-500" />}
                </div>
              </div>
              <Badge variant={isPro ? "default" : "secondary"} className={isPro ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                {isPro ? "Aktif" : "Dasar"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-500">Masa Berlaku</span>
                <span className="font-medium">
                  {profile?.membership_end
                    ? formatDate(profile.membership_end)
                    : 'Selamanya (Gratis)'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-500">Batas Kuota Sapi</span>
                <span className="font-medium">{isPro ? 'Unlimited' : '3 Ekor'}</span>
              </div>
            </div>

            {!isPro && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                onClick={() => navigate('/pricing')}
              >
                <Zap className="h-4 w-4" /> Upgrade ke Pro
              </Button>
            )}
            {isPro && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                onClick={() => navigate('/pricing')}
              >
                <Zap className="h-4 w-4" /> Perpanjang Paket
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
            <CardDescription>Riwayat tagihan langganan Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPayments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500">Belum ada riwayat transaksi pembayaran.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700">Paket Pro — 1 Bulan</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(payment.period_start)} – {formatDate(payment.period_end)}
                      </p>
                      <p className="text-xs text-slate-400">Ref: {payment.reference_id}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-slate-800">{formatCurrency(payment.amount)}</p>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs">
                        Berhasil
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}