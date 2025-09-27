'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute, AuthForm } from '@/components/auth';

export default function SignUpPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <ProtectedRoute requireAuth={false} redirectTo="/">
      <AuthForm onLoginSuccess={handleLoginSuccess} />
    </ProtectedRoute>
  );
}