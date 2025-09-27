'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  className?: string;
}

export const LazyWrapper = ({ 
  children, 
  fallback,
  delay = 0,
  className = ''
}: LazyWrapperProps) => {
  const defaultFallback = (
    <motion.div 
      className={`flex items-center justify-center min-h-[200px] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <LoadingSpinner size="large" />
    </motion.div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};