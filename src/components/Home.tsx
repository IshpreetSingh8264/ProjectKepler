'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaVideo, FaCode, FaRocket, FaHome } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from './Navbar';
import ImageProcessor from './ImageProcessor';
import VideoProcessor from './VideoProcessor';

interface HomeProps {
  onProfileClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onProfileClick }) => {
  const [selectedOption, setSelectedOption] = useState('home');
  const [currentView, setCurrentView] = useState<'home' | 'image' | 'video'>('home');

  // Handle option selection from navbar
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (option === 'home') {
      setCurrentView('home');
    } else if (option === 'image') {
      setCurrentView('image');
    } else if (option === 'video') {
      setCurrentView('video');
    } else {
      setCurrentView('home'); // Default to home for api or unknown options
    }
  };

  const optionContent = {
    home: {
      title: 'Welcome Home',
      description: 'Your central hub for AI-powered processing',
      icon: FaHome,
      color: 'from-blue-600 to-purple-600',
      features: [
        'Centralized dashboard',
        'Quick access to all tools',
        'Project management',
        'Recent activity tracking',
      ],
    },
    image: {
      title: 'Image Processing',
      description: 'Upload and process your images with advanced AI tools',
      icon: FaImage,
      color: 'from-purple-600 to-blue-600',
      features: [
        'AI-powered image enhancement',
        'Object detection and recognition', 
        'Drag & drop file upload',
        'URL image processing',
      ],
    },
    video: {
      title: 'Video Analysis',
      description: 'Analyze and process video content with cutting-edge technology',
      icon: FaVideo,
      color: 'from-green-600 to-blue-600',
      features: [
        'Real-time video processing',
        'Motion detection',
        'Drag & drop video upload',
        'URL video processing',
      ],
    },
    api: {
      title: 'API Integration',
      description: 'Coming Soon - Advanced API integration capabilities',
      icon: FaCode,
      color: 'from-orange-600 to-red-600',
      features: [
        'RESTful API endpoints',
        'Real-time data processing',
        'Secure authentication',
        'Scalable architecture',
      ],
    },
  };

  // Render different views
  if (currentView === 'image') {
    return (
      <div className="relative">
        <Navbar 
          onProfileClick={onProfileClick} 
          selectedOption="image" 
          onOptionSelect={handleOptionSelect}
        />
        <ImageProcessor />
      </div>
    );
  }

  if (currentView === 'video') {
    return (
      <div className="relative">
        <Navbar 
          onProfileClick={onProfileClick} 
          selectedOption="video" 
          onOptionSelect={handleOptionSelect}
        />
        <VideoProcessor />
      </div>
    );
  }

  // Home view
  const currentOption = optionContent[selectedOption as keyof typeof optionContent];
  const Icon = currentOption.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar 
        onProfileClick={onProfileClick}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
      />
      
      {/* Main content with proper top padding to account for fixed navbar */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className={`bg-gradient-to-r ${currentOption.color} bg-clip-text text-transparent`}>
              ProjectKepler
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Harness the power of AI and advanced processing to transform your digital content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Feature showcase */}
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${currentOption.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{currentOption.title}</CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      {currentOption.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentOption.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center text-slate-300"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentOption.color} mr-3`} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right side - Action area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Get Started</CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedOption === 'home' && 'Choose a tool from the navbar to get started'}
                  {selectedOption === 'image' && 'Click below to open the Image Processor'}
                  {selectedOption === 'video' && 'Click below to open the Video Processor'}
                  {selectedOption === 'api' && 'API integration coming soon'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOption === 'home' && (
                  <div className="text-center">
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        onClick={() => handleOptionSelect('image')}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-lg py-4"
                      >
                        <FaImage className="mr-2 h-4 w-4" />
                        Open Image Processor
                      </Button>
                      <Button 
                        onClick={() => handleOptionSelect('video')}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-lg py-4"
                      >
                        <FaVideo className="mr-2 h-4 w-4" />
                        Open Video Processor
                      </Button>
                      <Button 
                        disabled
                        className="w-full bg-slate-600 text-slate-400 cursor-not-allowed text-lg py-4"
                      >
                        <FaCode className="mr-2 h-4 w-4" />
                        API Integration (Coming Soon)
                      </Button>
                    </div>
                  </div>
                )}
                {selectedOption === 'image' && (
                  <div className="text-center">
                    <Button 
                      onClick={() => setCurrentView('image')}
                      className={`w-full bg-gradient-to-r ${currentOption.color} hover:opacity-90 text-lg py-6`}
                    >
                      <FaImage className="mr-2 h-5 w-5" />
                      Open Image Processor
                    </Button>
                  </div>
                )}

                {selectedOption === 'video' && (
                  <div className="text-center">
                    <Button 
                      onClick={() => setCurrentView('video')}
                      className={`w-full bg-gradient-to-r ${currentOption.color} hover:opacity-90 text-lg py-6`}
                    >
                      <FaVideo className="mr-2 h-5 w-5" />
                      Open Video Processor
                    </Button>
                  </div>
                )}

                {selectedOption === 'api' && (
                  <div className="text-center">
                    <Button 
                      disabled
                      className="w-full bg-slate-600 text-slate-400 cursor-not-allowed text-lg py-6"
                    >
                      <FaCode className="mr-2 h-5 w-5" />
                      Coming Soon
                    </Button>
                    <p className="text-slate-500 text-sm mt-2">
                      API integration features are under development
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional content to make page scrollable and test navbar behavior */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose ProjectKepler?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Experience cutting-edge AI processing with our intuitive interface and powerful features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Fast Processing', icon: FaRocket, desc: 'Lightning-fast AI-powered processing' },
              { title: 'Easy Upload', icon: FaImage, desc: 'Drag & drop or URL-based uploads' },
              { title: 'Multiple Formats', icon: FaVideo, desc: 'Support for various file formats' },
              { title: 'Secure', icon: FaCode, desc: 'Your data is processed securely' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-slate-800/30 rounded-lg p-6 backdrop-blur-sm border border-slate-700 text-center"
              >
                <feature.icon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Home;