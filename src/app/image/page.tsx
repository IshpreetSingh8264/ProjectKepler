'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaLink, FaEye, FaTrash, FaImage } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

const ImagePageContent = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          setImageUrl(''); // Clear URL input when file is selected
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
        setImageUrl(''); // Clear URL input when file is selected
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
    // Simulate processing time
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar onProfileClick={() => {}} />      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Image Processor</h1>
            <p className="text-slate-400">Upload or link an image to process</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Upload Image</h2>
              
              {/* Drag & Drop Area */}
              <motion.div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                  ${isDragOver 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-slate-600 hover:border-slate-500'
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaUpload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-white mb-2">
                    {isDragOver ? 'Drop your image here' : 'Drag & drop your image here'}
                  </p>
                  <p className="text-slate-400 mb-4">or</p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Select from Computer
                  </Button>
                </motion.div>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* URL Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Or enter image URL:
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                  <Button
                    onClick={handleUrlSubmit}
                    disabled={!imageUrl.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FaLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview Section */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Image Preview</h2>
                {selectedImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                    className="text-slate-300 border-slate-600 hover:bg-slate-700"
                  >
                    <FaTrash className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {selectedImage ? (
                  <motion.div
                    key="image-preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-64 object-contain bg-slate-900 rounded-lg"
                      />
                      
                      {/* Processing Animation Overlay */}
                      <AnimatePresence>
                        {isProcessing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 rounded-lg flex items-center justify-center"
                          >
                            {/* Processing Gradient Animation */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent"
                              animate={{
                                background: [
                                  'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)',
                                  'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)',
                                  'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)'
                                ]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            />
                            
                            {/* Processing Text */}
                            <motion.div
                              className="relative z-10 text-center"
                              animate={{
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <div className="text-white text-lg font-semibold mb-2">
                                Processing...
                              </div>
                              <motion.div
                                className="flex space-x-1 justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                    animate={{
                                      scale: [1, 1.5, 1],
                                      opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      repeat: Infinity,
                                      delay: i * 0.2
                                    }}
                                  />
                                ))}
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Detect Button */}
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        onClick={handleDetect}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                      >
                        <FaEye className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Detect'}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center"
                  >
                    <div className="text-center">
                      <FaImage className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">No image selected</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
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