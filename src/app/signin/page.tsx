'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthForm from '@/components/AuthForm';

export default function SignInPage() {
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