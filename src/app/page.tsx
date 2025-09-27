'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner, LazyWrapper } from '@/components/common';
import { useAuth } from '@/lib/authContext';

// Lazy load AuthForm
const AuthForm = lazy(() => import('@/components/auth/AuthForm'));

type AppState = 'auth' | 'profile' | 'home' | 'profile-edit';

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
    return <LoadingSpinner />;
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <LazyWrapper>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner />
            </div>
          }>
            <AuthForm onLoginSuccess={handleLoginSuccess} />
          </Suspense>
        </LazyWrapper>
      </div>
    );
  }

  // This shouldn't be reached due to the useEffect redirect, but just in case
  return <LoadingSpinner />;
}
