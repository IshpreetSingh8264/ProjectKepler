'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaKey, FaLock } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/common';
import { ApiKeysManager } from '@/components/modals';
import { useAuth } from '@/lib/authContext';

export default function ApiDocsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar onProfileClick={handleProfileClick} />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
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
              className="bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full shadow-lg w-20 h-20 flex items-center justify-center mx-auto mb-6"
            >
              <FaKey className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
            >
              API{' '}
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Keys
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto mb-8"
            >
              Manage your API keys to access ProjectKepler's image and video processing services
            </motion.p>
          </motion.div>

          {/* API Keys Section */}
          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ApiKeysManager />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardHeader className="py-12">
                  <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-r from-red-600 to-orange-600 w-20 h-20 flex items-center justify-center">
                    <FaLock className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white mb-4">
                    Authentication Required
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-lg max-w-md mx-auto">
                    Please sign in to your account to view and manage your API keys for ProjectKepler services.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          )}

          {/* Quick Info Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl text-white text-center">
                  Available Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Image Processing</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• YOLO object detection</li>
                      <li>• Image analysis and annotation</li>
                      <li>• Batch processing support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Video Processing</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Video analysis and detection</li>
                      <li>• Frame-by-frame processing</li>
                      <li>• Real-time streaming support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}