import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Toaster } from '@/src/components/ui/sonner';

// Lazy load pages to decrease initial bundle size, improve FCP, and prevent TBT degradation
const Landing = lazy(() => import('@/src/pages/Landing'));
const Login = lazy(() => import('@/src/pages/Login'));
const Register = lazy(() => import('@/src/pages/Register'));
const Dashboard = lazy(() => import('@/src/pages/Dashboard'));
const SapiList = lazy(() => import('@/src/pages/SapiList'));
const SapiDetail = lazy(() => import('@/src/pages/SapiDetail'));
const SapiForm = lazy(() => import('@/src/pages/SapiForm'));
const Pakan = lazy(() => import('@/src/pages/Pakan'));
const Berat = lazy(() => import('@/src/pages/Berat'));
const Keuangan = lazy(() => import('@/src/pages/Keuangan'));
const Kesehatan = lazy(() => import('@/src/pages/Kesehatan'));
const Settings = lazy(() => import('@/src/pages/Settings'));

// Layout
import AppLayout from '@/src/components/layout/AppLayout';

// Seamless Loading Fallback component for Suspense chunks
function PerformancePageLoader() {
  return (
    <div className="flex min-h-[60vh] h-full w-full items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <p className="text-xs font-semibold text-slate-500 tracking-wide animate-pulse uppercase">Memuat Halaman...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { setUser, user } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-650 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-700 tracking-wide animate-pulse">Menghubungkan SIPETIK...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PerformancePageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

          {/* Protected Routes */}
          <Route element={user ? <AppLayout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sapi" element={<SapiList />} />
            <Route path="/sapi/new" element={<SapiForm />} />
            <Route path="/sapi/edit/:id" element={<SapiForm />} />
            <Route path="/sapi/:id" element={<SapiDetail />} />
            <Route path="/pakan" element={<Pakan />} />
            <Route path="/berat" element={<Berat />} />
            <Route path="/keuangan" element={<Keuangan />} />
            <Route path="/kesehatan" element={<Kesehatan />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

