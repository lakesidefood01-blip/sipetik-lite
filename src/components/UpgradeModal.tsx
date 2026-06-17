import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Check, X, ShieldCheck, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function UpgradeModal({ isOpen, onClose, message }: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden z-10 border"
        >
          {/* Header */}
          <div className="bg-gradient-to-tr from-emerald-600 to-emerald-400 p-6 text-white text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto bg-black/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-md shadow-inner text-yellow-300">
              <Zap className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Upgrade ke SIPETIK Pro</h2>
            {message ? (
              <p className="mt-2 text-emerald-50 text-sm">{message}</p>
            ) : (
              <p className="mt-2 text-emerald-50 text-sm">Buka semua fitur tak terbatas untuk mengelola peternakan skala besar Anda.</p>
            )}
          </div>

          {/* Benefits */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Keuntungan Paket Pro</h3>
            <ul className="space-y-3">
              {[
                'Kelola sapi tanpa batas (Unlimited)',
                'Cetak Laporan PDF Eksekutif',
                'Akses Analitik & Grafik Keuangan Lanjut',
                'Dashboard Khusus Premium',
                'Sistem Pengingat (Reminder) Kesehatan'
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-500/20 p-1 rounded-full text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Action */}
            <div className="pt-4">
              <Button onClick={handleUpgradeClick} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold text-md">
                Lihat Paket & Harga
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full mt-2 text-muted-foreground hover:text-foreground">
                Mungkin Nanti
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
