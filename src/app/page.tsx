'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthForm from '@/components/AuthForm';

export default function App() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/home');
  };

  useEffect(() => {
    if (!loading && user) {
      // User is logged in, redirect to home
      router.push('/home');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <AuthForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // This shouldn't be reached due to the useEffect redirect, but just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
