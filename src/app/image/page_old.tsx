'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaLink, FaEye, FaTrash, FaImage, FaCog, FaChartLine, FaRocket, FaShieldAlt, FaDownload, FaShare, FaHistory } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Navbar, LoadingSpinner, LazyWrapper, LazyImage, ProcessingOverlay } from '@/components/common';
import { ProtectedRoute } from '@/components/auth';

const ImagePageContent = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(''); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setImageUrl('');
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setSelectedImage(imageUrl.trim());
    }
  };

  const handleDetect = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageUrl('');
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen space-station-bg relative overflow-hidden">
      {/* Space Grid Background */}
      <div className="absolute inset-0 space-grid opacity-20"></div>
      
      <Navbar onProfileClick={handleProfileClick} />
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FaEye className="h-20 w-20 text-blue-400 mx-auto mb-6 space-text-glow" />
              <h1 className="text-5xl font-bold text-white mb-4">
                <span className="text-gray-400 text-2xl font-normal block mb-2">SENSOR MODULE</span>
                Object Detection
              </h1>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Advanced AI-powered detection system for space station critical objects. 
                Upload images to identify Toolboxes, Oxygen Tanks, and Fire Extinguishers.
                <br />
                <span className="text-sm text-blue-400/60 italic mt-2 block">
                  "In the vacuum of space, every tool tells a story..." 
                  <span className="text-xs text-gray-600 ml-2">// 42 is the answer to everything</span>
                </span>
              </p>
            </motion.div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Main Detection Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Left Column - Upload Interface */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="space-card h-full">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                        <FaUpload className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Image Input</h3>
                        <p className="text-gray-400 text-sm">Upload or provide image URL</p>
                      </div>
                    </div>

                    {/* Enhanced Drag & Drop Area */}
                    <motion.div
                      className={`
                        relative flex-1 min-h-[300px] border-2 border-dashed rounded-2xl 
                        transition-all duration-300 cursor-pointer group
                        ${isDragOver 
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/25' 
                          : 'border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/5'
                        }
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 rounded-2xl"></div>
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
                        <motion.div
                          animate={isDragOver ? { 
                            scale: [1, 1.1, 1], 
                            rotate: [0, 5, -5, 0] 
                          } : {}}
                          transition={{ duration: 0.5 }}
                          className="mb-6"
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                            <FaUpload className="h-10 w-10 text-white" />
                          </div>
                        </motion.div>
                        
                        <h4 className="text-2xl font-semibold text-white mb-3">
                          {isDragOver ? 'Release to Upload' : 'Drag & Drop Image'}
                        </h4>
                        <p className="text-gray-400 mb-6 max-w-sm">
                          Drop your space station image here, or click to browse files
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0"
                            size="lg"
                          >
                            Browse Files
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-4">
                          Supports: JPG, PNG, GIF • Max: 10MB
                        </div>
                      </div>
                    </motion.div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* URL Input Section */}
                    <div className="mt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                        <span className="px-4 text-gray-400 text-sm font-mono">OR PASTE URL</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <FaLink className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="pl-12 bg-slate-800/50 border-blue-500/20 text-white placeholder:text-gray-500 focus:border-cyan-400 h-12 rounded-xl"
                          />
                        </div>
                        <Button
                          onClick={handleUrlSubmit}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 h-12 rounded-xl"
                          disabled={!imageUrl.trim()}
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Right Column - Detection Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="space-card h-full">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                        <FaEye className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Detection Status</h3>
                        <p className="text-gray-400 text-sm">AI model ready for analysis</p>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      {!selectedImage ? (
                        <div className="space-y-6">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <FaImage className="h-12 w-12 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-300 mb-2">No Image Selected</h4>
                            <p className="text-gray-500 text-sm">Upload an image to begin detection</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 w-full">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto">
                            <FaEye className="h-12 w-12 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-white mb-2">Image Ready</h4>
                            <p className="text-gray-400 text-sm mb-6">Click below to start AI detection</p>
                            
                            <Button
                              onClick={handleDetect}
                              disabled={isProcessing}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 text-lg font-semibold rounded-xl"
                              size="lg"
                            >
                              {isProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaRocket className="h-3 w-3 text-white" />
                                  </div>
                                  Start Detection
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detection Stats */}
                    <div className="border-t border-gray-700 pt-6 mt-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-400 font-mono">YOLOv8</div>
                          <div className="text-xs text-gray-500">AI Model</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-cyan-400 font-mono">~2.3s</div>
                          <div className="text-xs text-gray-500">Avg Time</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400 font-mono">99.2%</div>
                          <div className="text-xs text-gray-500">Accuracy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Image Preview & Results Section */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-8"
                >
                  {/* Image Analysis Dashboard */}
                  <Card className="space-card overflow-hidden">
                    <div className="p-8">
                      {/* Header with Controls */}
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                            <FaImage className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-white mb-1">Analysis Dashboard</h3>
                            <p className="text-gray-400">AI-powered object detection in progress</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={clearImage}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-400"
                          >
                            <FaTrash className="h-4 w-4 mr-2" />
                            Clear
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Main Image Display */}
                        <div className="xl:col-span-2 space-y-6">
                          <LazyWrapper delay={0.1}>
                            <div className="relative group">
                              {/* Image Container with Advanced Styling */}
                              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                                {/* Tech Grid Overlay */}
                                <div className="absolute inset-0 opacity-20">
                                  <div className="w-full h-full bg-grid-pattern"></div>
                                </div>
                                
                                <div className="relative rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm">
                                  <LazyImage
                                    src={selectedImage}
                                    alt="Selected Image for Analysis"
                                    className="w-full h-96 object-contain"
                                  />
                                  
                                  {/* Processing Overlay with Better Animation */}
                                  <ProcessingOverlay isProcessing={isProcessing} />
                                  
                                  {/* Scanning Effect */}
                                  {isProcessing && (
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                                      animate={{
                                        x: ['-100%', '100%'],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                      }}
                                    />
                                  )}
                                </div>
                                
                                {/* Image Info Bar */}
                                <div className="mt-4 flex justify-between items-center text-sm">
                                  <div className="flex items-center space-x-4 text-gray-400">
                                    <span>Status: <span className="text-green-400">Ready</span></span>
                                  </div>
                                  <div className="text-gray-500 font-mono">
                                    Resolution: Auto-detected
                                  </div>
                                </div>
                              </div>
                            </div>
                          </LazyWrapper>
                        </div>

                        {/* Detection Control Panel */}
                        <div className="space-y-6">
                          {/* Detection Controls */}
                          <div className="space-card p-6">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <FaCog className="h-5 w-5 text-blue-400 mr-2" />
                              Detection Controls
                            </h4>
                            
                            <div className="space-y-4">
                              {/* Confidence Threshold */}
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Confidence Threshold
                                </label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="range"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    defaultValue="0.5"
                                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <span className="text-blue-400 font-mono text-sm">50%</span>
                                </div>
                              </div>
                              
                              {/* Target Objects */}
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                  Target Objects
                                </label>
                                <div className="space-y-2">
                                  {['Toolbox', 'Oxygen Tank', 'Fire Extinguisher'].map((obj) => (
                                    <label key={obj} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-3 text-gray-300 text-sm">{obj}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Real-time Stats */}
                          <div className="space-card p-6">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                              <FaChartLine className="h-5 w-5 text-green-400 mr-2" />
                              Analysis Stats
                            </h4>
                            
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Processing Speed</span>
                                <span className="text-cyan-400 font-mono">Real-time</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Model Version</span>
                                <span className="text-blue-400 font-mono">YOLOv8n</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-400">Input Size</span>
                                <span className="text-purple-400 font-mono">640x640</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Detection Results Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12"
            >
              <Card className="space-card">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                        <FaEye className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-1">Detection Results</h3>
                        <p className="text-gray-400">Object detection and classification results</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400 font-mono">3 Objects</div>
                      <div className="text-sm text-gray-500">Detected</div>
                    </div>
                  </div>

                  {/* Placeholder Results - This would be populated by actual detection results */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      { name: 'Toolbox', confidence: 95.8, color: 'blue', icon: FaCog },
                      { name: 'Oxygen Tank', confidence: 87.3, color: 'cyan', icon: FaRocket },
                      { name: 'Fire Extinguisher', confidence: 92.1, color: 'green', icon: FaShieldAlt }
                    ].map((detection, index) => (
                      <motion.div
                        key={detection.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="space-card p-6 text-center group hover:space-glow transition-all duration-300"
                      >
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${detection.color}-500 to-${detection.color}-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <detection.icon className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">{detection.name}</h4>
                        <div className="text-3xl font-bold text-green-400 mb-1 font-mono">
                          {detection.confidence}%
                        </div>
                        <div className="text-sm text-gray-400">Confidence</div>
                        
                        {/* Confidence Bar */}
                        <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r from-${detection.color}-500 to-${detection.color}-400`}
                            initial={{ width: 0 }}
                            animate={{ width: `${detection.confidence}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      <FaDownload className="h-4 w-4 mr-2" />
                      Download Results
                    </Button>
                    <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20">
                      <FaShare className="h-4 w-4 mr-2" />
                      Share Analysis
                    </Button>
                    <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20">
                      <FaHistory className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ImagePage = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <ImagePageContent />
    </ProtectedRoute>
  );
};

export default ImagePage;