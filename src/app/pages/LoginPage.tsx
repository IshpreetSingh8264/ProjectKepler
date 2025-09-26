// Authentication page wrapper
'use client';

import AuthForm from '@/components/AuthForm';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return <AuthForm onLoginSuccess={onLoginSuccess} />;
};

export default LoginPage;