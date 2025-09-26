'use client';

import { useState, useEffect } from 'react';
import LoginPage from '@/app/pages/LoginPage';
import ProfilePage from '@/app/pages/ProfilePage';
import HomePage from '@/app/pages/HomePage';
import ProfileEditPage from '@/app/pages/ProfileEditPage';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageTransition from '@/components/PageTransition';
import FloatingParticles from '@/components/FloatingParticles';
import { isLoggedIn, getUser } from '@/lib/localStorage';

type AppState = 'auth' | 'profile' | 'home' | 'profile-edit';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and profile is completed
    if (isLoggedIn()) {
      const user = getUser();
      if (user?.profileCompleted) {
        setAppState('home');
      } else {
        setAppState('profile');
      }
    } else {
      setAppState('auth');
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const user = getUser();
    if (user?.profileCompleted) {
      setAppState('home');
    } else {
      setAppState('profile');
    }
  };

  const handleProfileComplete = () => {
    setAppState('home');
  };

  const handleProfileClick = () => {
    setAppState('profile-edit');
  };

  const handleBackToHome = () => {
    setAppState('home');
  };

  const handleLogout = () => {
    setAppState('auth');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <FloatingParticles />
      <PageTransition pageKey={appState}>
        {appState === 'auth' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {appState === 'profile' && <ProfilePage onComplete={handleProfileComplete} />}
        {appState === 'home' && <HomePage onProfileClick={handleProfileClick} />}
        {appState === 'profile-edit' && (
          <ProfileEditPage onBack={handleBackToHome} onLogout={handleLogout} />
        )}
      </PageTransition>
    </>
  );
}
