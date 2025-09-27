'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaVideo, 
  FaCog, 
  FaRocket, 
  FaCode, 
  FaLightbulb, 
  FaGithub,
  FaPlayCircle,
  FaMagic,
  FaChartLine,
  FaBrain
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/common';
import { ProtectedRoute } from '@/components/auth';

const VideoPageContent = () => {
  const router = useRouter();
  const [animationStep, setAnimationStep] = useState(0);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const developmentFeatures = [
    {
      icon: FaBrain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms for video content understanding',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: FaMagic,
      title: 'Smart Processing',
      description: 'Intelligent video enhancement and object detection capabilities',
      color: 'from-blue-600 to-purple-600'
    },
    {
      icon: FaChartLine,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights and detailed performance metrics',
      color: 'from-green-600 to-blue-600'
    },
    {
      icon: FaRocket,
      title: 'High Performance',
      description: 'Optimized processing pipeline for lightning-fast results',
      color: 'from-orange-600 to-red-600'
    }
  ];

  const progressSteps = [
    { label: 'Core Architecture', progress: 85 },
    { label: 'AI Model Integration', progress: 70 },
    { label: 'UI/UX Design', progress: 60 },
    { label: 'Testing & Optimization', progress: 30 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Navbar onProfileClick={handleProfileClick} />
      
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-50"
                />
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full">
                  <FaVideo className="h-20 w-20 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Video Processor
              <span className="block text-3xl md:text-4xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-2">
                Coming Soon
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-slate-300 max-w-3xl mx-auto mb-8"
            >
              We're building something incredible! Our AI-powered video processing platform 
              will revolutionize how you analyze and enhance your video content.
            </motion.p>

            {/* Development Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-full backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <FaCog className="h-5 w-5 text-green-400" />
              </motion.div>
              <span className="text-green-400 font-semibold">Currently in Development</span>
            </motion.div>
          </div>

          {/* Features Preview */}
          <div className="max-w-6xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              What's Coming
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {developmentFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-slate-600 transition-all duration-300 group">
                    <CardHeader className="text-center">
                      <motion.div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ y: -5 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-slate-400 text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Development Progress */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-2">Development Progress</CardTitle>
                <CardDescription className="text-slate-400">
                  Track our progress as we build this amazing feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {progressSteps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{step.label}</span>
                      <span className="text-slate-400 text-sm">{step.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                        transition={{ duration: 1.5, delay: 2.0 + index * 0.2, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div> */}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="text-center mt-16"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Stay Tuned!</h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              We're working hard to bring you the most advanced video processing capabilities. 
              Follow our progress and be the first to know when it's ready!
            </p>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => router.push('/image')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 text-lg"
                size="lg"
              >
                <FaPlayCircle className="mr-2 h-5 w-5" />
                Try Image Processing
              </Button>
              
              <Button 
                onClick={() => router.push('/developer')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 px-8 py-3 text-lg"
                size="lg"
              >
                <FaCode className="mr-2 h-5 w-5" />
                View API Docs
              </Button>
            </div>
          </motion.div>

          {/* Floating Animation Elements */}
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2">
            <motion.div
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-purple-500/30"
            >
              <FaLightbulb className="h-8 w-8" />
            </motion.div>
          </div>

          <div className="absolute top-1/3 right-10">
            <motion.div
              animate={{
                y: [20, -20, 20],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-blue-500/30"
            >
              <FaRocket className="h-10 w-10" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const VideoPage = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <VideoPageContent />
    </ProtectedRoute>
  );
};

export default VideoPage;