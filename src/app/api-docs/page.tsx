'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaRocket, FaLock, FaPlug, FaCog, FaDatabase, FaKey, FaArrowLeft } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ApiKeysManager from '@/components/ApiKeysManager';
import { useAuth } from '@/lib/authContext';

export default function ApiDocsPage() {
  const { user } = useAuth();
  const [showApiKeys, setShowApiKeys] = useState(false);

  const handleProfileClick = () => {
    // Profile functionality would be handled by routing
    console.log('Profile clicked');
  };

  if (showApiKeys) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar onProfileClick={handleProfileClick} />
        
        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Button
                onClick={() => setShowApiKeys(false)}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to API Documentation
              </Button>
            </motion.div>

            {/* API Keys Manager */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ApiKeysManager />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full shadow-lg"
              >
                <FaCode className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl sm:text-6xl font-bold text-white mb-6"
            >
              API{' '}
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Documentation
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Comprehensive API integration capabilities for developers. 
              Build powerful applications with our processing services.
            </motion.p>

            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  onClick={() => setShowApiKeys(true)}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg"
                >
                  <FaKey className="mr-2" />
                  Manage API Keys
                </Button>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-lg font-semibold opacity-60">
                  <FaCog className="mr-2 animate-spin" />
                  Endpoints Under Development
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <p className="text-slate-400 mb-4">Please log in to manage your API keys</p>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full text-lg font-semibold opacity-60">
                  <FaCog className="mr-2 animate-spin" />
                  Under Development
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* REST API Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 h-full opacity-60">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 w-fit">
                    <FaPlug className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">REST API Endpoints</CardTitle>
                  <CardDescription className="text-slate-400">
                    RESTful services for image and video processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      POST /api/image/process
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      POST /api/video/analyze
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      GET /api/results/[id]
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      WebSocket support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Authentication Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className={`bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 h-full ${!user ? 'opacity-60' : ''}`}>
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 w-fit ${user ? 'animate-pulse' : ''}`}>
                    <FaLock className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">
                    {user ? 'API Authentication Ready' : 'Secure Authentication'}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {user ? 'Your account is ready for API access' : 'JWT-based authentication and API keys'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-center">
                      <div className={`w-2 h-2 ${user ? 'bg-green-500' : 'bg-orange-500'} rounded-full mr-3`} />
                      {user ? 'User authenticated ✓' : 'JWT token authentication'}
                    </li>
                    <li className="flex items-center">
                      <div className={`w-2 h-2 ${user ? 'bg-green-500' : 'bg-orange-500'} rounded-full mr-3`} />
                      {user ? 'API key generation available ✓' : 'API key management'}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Rate limiting (coming soon)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Usage analytics (coming soon)
                    </li>
                  </ul>
                  {user && (
                    <div className="mt-4">
                      <Button
                        onClick={() => setShowApiKeys(true)}
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                      >
                        <FaKey className="mr-2 h-3 w-3" />
                        Manage Keys
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Database Integration Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-all duration-300 h-full opacity-60">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 w-fit">
                    <FaDatabase className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Data Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Scalable data storage and retrieval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Cloud storage integration
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Metadata management
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Processing history
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                      Result caching
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Current Status Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-16 text-center"
          >
            <Card className="bg-slate-800/30 border-slate-700 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center justify-center">
                  {user ? (
                    <>
                      <FaKey className="mr-3 text-green-500" />
                      Ready to Generate API Keys!
                    </>
                  ) : (
                    <>
                      <FaRocket className="mr-3 text-orange-500" />
                      Get Started with API Access
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  {user ? (
                    'Your account is set up and ready. Generate your first API key to start building with ProjectKepler.'
                  ) : (
                    'Sign in to your account to generate API keys and start integrating with our services.'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                {user ? (
                  <Button 
                    onClick={() => setShowApiKeys(true)}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg"
                  >
                    <FaKey className="mr-2" />
                    Generate API Key
                  </Button>
                ) : (
                  <Button 
                    disabled
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg opacity-60 cursor-not-allowed"
                  >
                    Sign In Required
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mt-16 text-slate-400"
          >
            <p>Return to the <span className="text-orange-400">Home</span> page to explore our current image and video processing capabilities.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}