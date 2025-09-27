'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaRocket, FaImage, FaVideo, FaCode } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/common';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/authContext';

const HomeContent = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleProfileClick = () => {
    // Navigate to profile page
    router.push('/profile');
  };

  const features = [
    {
      id: 'image',
      title: 'Image Processing',
      description: 'Upload and process your images with advanced AI tools',
      icon: FaImage,
      color: 'from-blue-600 to-purple-600',
      path: '/image'
    },
    {
      id: 'video',
      title: 'Video Analysis',
      description: 'Analyze and process video content with AI',
      icon: FaVideo,
      color: 'from-green-600 to-blue-600',
      path: '/video'
    },
    {
      id: 'api',
      title: 'API Documentation',
      description: 'Explore our comprehensive API documentation',
      icon: FaCode,
      color: 'from-purple-600 to-pink-600',
      path: '/api-docs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar onProfileClick={handleProfileClick} />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <FaRocket className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  ProjectKepler
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Your central hub for AI-powered image and video processing
              </p>
            </motion.div>

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-slate-400">
                  Welcome back, <span className="text-blue-400">{user.email}</span>!
                </p>
              </motion.div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer group"
                      onClick={() => router.push(feature.path)}>
                  <CardHeader className="text-center">
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className={`bg-gradient-to-r ${feature.color} hover:opacity-90 transition-opacity`}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(feature.path);
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-slate-800/30 border-slate-700 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Ready to Process</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">∞</div>
                    <div className="text-slate-400">Images Processed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
                    <div className="text-slate-400">Videos Analyzed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                    <div className="text-slate-400">Availability</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <HomeContent />
    </ProtectedRoute>
  );
};

export default HomePage;