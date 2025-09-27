'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { LoadingSpinner } from '@/components/common';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, require authentication; if false, redirect if authenticated
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth state to load

    if (requireAuth && !user) {
      // Redirect to login if authentication is required and user is not logged in
      router.push('/');
    } else if (!requireAuth && user) {
      // Redirect logged-in users away from auth pages
      router.push(redirectTo || '/');
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show content if:
  // - Auth is required and user is logged in
  // - Auth is not required and user is not logged in
  if ((requireAuth && user) || (!requireAuth && !user)) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
