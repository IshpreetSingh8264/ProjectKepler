'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaVideo, FaCode, FaUpload, FaPlay, FaTerminal } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from './Navbar';

interface HomeProps {
  onProfileClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onProfileClick }) => {
  const [selectedOption, setSelectedOption] = useState('image');

  const optionContent = {
    image: {
      title: 'Image Processing',
      description: 'Upload and process your images with advanced AI tools',
      icon: FaImage,
      color: 'from-purple-600 to-blue-600',
      features: [
        'AI-powered image enhancement',
        'Object detection and recognition',
        'Image format conversion',
        'Batch processing support',
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
        'Content analysis',
        'Format optimization',
      ],
    },
    api: {
      title: 'API Integration',
      description: 'Connect and integrate with powerful APIs and services',
      icon: FaCode,
      color: 'from-orange-600 to-red-600',
      features: [
        'RESTful API endpoints',
        'Real-time data processing',
        'Secure authentication',
        'Rate limiting and monitoring',
      ],
    },
  };

  const currentOption = optionContent[selectedOption as keyof typeof optionContent];
  const Icon = currentOption.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar 
        onProfileClick={onProfileClick}
        selectedOption={selectedOption}
        onOptionSelect={setSelectedOption}
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
                  {selectedOption === 'image' && 'Upload your images to begin processing'}
                  {selectedOption === 'video' && 'Upload or link your video content'}
                  {selectedOption === 'api' && 'Configure your API endpoints and keys'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOption === 'image' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors">
                      <FaUpload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-2">Drag and drop your images here</p>
                      <p className="text-slate-500 text-sm mb-4">or click to browse</p>
                      <Button className={`bg-gradient-to-r ${currentOption.color} hover:opacity-90`}>
                        Select Images
                      </Button>
                    </div>
                  </div>
                )}

                {selectedOption === 'video' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl" className="text-slate-200">Video URL</Label>
                      <Input
                        id="videoUrl"
                        placeholder="https://example.com/video.mp4"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 mb-4">or</p>
                      <Button className={`bg-gradient-to-r ${currentOption.color} hover:opacity-90`}>
                        <FaPlay className="mr-2 h-4 w-4" />
                        Upload Video
                      </Button>
                    </div>
                  </div>
                )}

                {selectedOption === 'api' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="text-slate-200">API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="Enter your API key"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endpoint" className="text-slate-200">Endpoint URL</Label>
                      <Input
                        id="endpoint"
                        placeholder="https://api.example.com/v1"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <Button className={`w-full bg-gradient-to-r ${currentOption.color} hover:opacity-90`}>
                      <FaTerminal className="mr-2 h-4 w-4" />
                      Test Connection
                    </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-slate-800/30 rounded-lg p-6 backdrop-blur-sm border border-slate-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Feature {item}</h3>
                <p className="text-slate-400 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* More content for scrolling */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose ProjectKepler?</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              "Advanced AI Processing",
              "Real-time Performance",
              "Secure & Reliable",
              "Easy Integration"
            ].map((feature, index) => (
              <div 
                key={feature}
                className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-8 backdrop-blur-sm border border-slate-600"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">{feature}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer spacing */}
        <div className="h-40"></div>
      </div>
    </div>
  );
};

export default Home;