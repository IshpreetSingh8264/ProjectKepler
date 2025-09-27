'use client';

import { Suspense, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AppLoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

export const AppLoadingBoundary = ({ 
  children, 
  fallback, 
  name = 'content' 
}: AppLoadingBoundaryProps) => {
  const defaultFallback = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <LoadingSpinner message={`Loading ${name}...`} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};