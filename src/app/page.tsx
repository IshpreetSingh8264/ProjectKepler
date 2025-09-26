'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/pages/LoginPage';
import ProfilePage from '@/app/pages/ProfilePage';
import ProfileEditPage from '@/app/pages/ProfileEditPage';
import { LoadingSpinner, PageTransition, FloatingParticles, Navbar } from '@/components/common';
import { motion } from 'framer-motion';
import { FaRocket, FaImage, FaVideo, FaCode } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isLoggedIn, getUser } from '@/lib/localStorage';

type AppState = 'auth' | 'profile' | 'home' | 'profile-edit';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  if (appState === 'auth') {
    return (
      <>
        <FloatingParticles />
        <PageTransition pageKey="auth">
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        </PageTransition>
      </>
    );
  }

  if (appState === 'profile') {
    return (
      <>
        <FloatingParticles />
        <PageTransition pageKey="profile">
          <ProfilePage onComplete={handleProfileComplete} />
        </PageTransition>
      </>
    );
  }

  if (appState === 'profile-edit') {
    return (
      <>
        <FloatingParticles />
        <PageTransition pageKey="profile-edit">
          <ProfileEditPage onBack={handleBackToHome} onLogout={handleLogout} />
        </PageTransition>
      </>
    );
  }

  // Main home dashboard with routing
  return (
    <>
      <FloatingParticles />
      <PageTransition pageKey="home">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Navbar onProfileClick={handleProfileClick} />
          
          <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.2,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-lg"
                  >
                    <FaRocket className="h-12 w-12 text-white" />
                  </motion.div>
                </div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-5xl sm:text-6xl font-bold text-white mb-6"
                >
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    ProjectKepler
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed"
                >
                  Your central hub for AI-powered processing. Upload, analyze, and transform your images and videos 
                  with cutting-edge technology.
                </motion.p>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Image Processing Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => router.push('/image')}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 w-fit group-hover:scale-110 transition-transform duration-300">
                        <FaImage className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-white">Image Processing</CardTitle>
                      <CardDescription className="text-slate-400">
                        AI-powered image enhancement and analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                          AI-powered enhancement
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                          Object detection
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                          Drag & drop upload
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                          URL processing
                        </li>
                      </ul>
                      <Button 
                        onClick={() => router.push('/image')}
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Start Image Processing
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Video Processing Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => router.push('/video')}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-green-600 to-blue-600 w-fit group-hover:scale-110 transition-transform duration-300">
                        <FaVideo className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-white">Video Analysis</CardTitle>
                      <CardDescription className="text-slate-400">
                        Advanced video processing and motion detection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          Real-time processing
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          Motion detection
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          Drag & drop upload
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                          URL processing
                        </li>
                      </ul>
                      <Button 
                        onClick={() => router.push('/video')}
                        className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                      >
                        Start Video Analysis
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* API Integration Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group h-full opacity-60">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 w-fit group-hover:scale-110 transition-transform duration-300">
                        <FaCode className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-white">API Integration</CardTitle>
                      <CardDescription className="text-slate-400">
                        Coming Soon - Advanced API capabilities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-slate-300">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                          RESTful endpoints
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                          Real-time processing
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                          Secure authentication
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                          Scalable architecture
                        </li>
                      </ul>
                      <Button 
                        disabled
                        className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 opacity-50 cursor-not-allowed text-white"
                      >
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-16 text-slate-400"
              >
                <p>Ready to transform your media? Select a processing option above to get started.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
}
