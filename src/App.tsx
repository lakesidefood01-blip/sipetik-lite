import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { useAppStore } from '@/src/store/useAppStore';
import { Toaster } from '@/src/components/ui/sonner';

// Pages
import Landing from '@/src/pages/Landing';
import Login from '@/src/pages/Login';
import Register from '@/src/pages/Register';
import Dashboard from '@/src/pages/Dashboard';
import SapiList from '@/src/pages/SapiList';
import SapiDetail from '@/src/pages/SapiDetail';
import SapiForm from '@/src/pages/SapiForm';
import Pakan from '@/src/pages/Pakan';
import Berat from '@/src/pages/Berat';
import Keuangan from '@/src/pages/Keuangan';
import Kesehatan from '@/src/pages/Kesehatan';
import Settings from '@/src/pages/Settings';

// Layout
import AppLayout from '@/src/components/layout/AppLayout';

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
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
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
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

