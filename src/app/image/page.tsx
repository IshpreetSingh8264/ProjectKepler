'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaLink, FaEye, FaTrash, FaImage } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar onProfileClick={handleProfileClick} />
      <div className="container mx-auto px-4 py-8 pt-24">
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
              <FaImage className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-3">Image Processor</h1>
              <p className="text-slate-400 text-lg">Transform your images with AI-powered processing</p>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {/* Upload Section */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="p-8">
                {/* Drag & Drop Area */}
                <motion.div
                  className={`
                    border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                    ${isDragOver 
                      ? 'border-blue-400 bg-blue-500/10 scale-105' 
                      : 'border-slate-600 hover:border-blue-500/50 hover:bg-slate-800/30'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaUpload className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {isDragOver ? 'Drop it here!' : 'Upload Your Image'}
                    </h3>
                    <p className="text-slate-400 mb-6">Drag & drop or click to select</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                      size="lg"
                    >
                      Choose File
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

                {/* Divider */}
                <div className="flex items-center my-8">
                  <div className="flex-1 border-t border-slate-600"></div>
                  <span className="px-4 text-slate-400 text-sm">OR</span>
                  <div className="flex-1 border-t border-slate-600"></div>
                </div>

                {/* URL Input */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="Paste image URL here..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 h-12 text-lg"
                    />
                  </div>
                  <Button
                    onClick={handleUrlSubmit}
                    className="bg-purple-600 hover:bg-purple-700 px-6 h-12"
                    disabled={!imageUrl.trim()}
                  >
                    <FaLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview Section */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Image Preview</h3>
                        <Button
                          onClick={clearImage}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <FaTrash className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                      <LazyWrapper delay={0.1}>
                        <div className="relative rounded-lg overflow-hidden bg-slate-900/50">
                          <LazyImage
                            src={selectedImage}
                            alt="Selected"
                            className="w-full h-64 object-contain"
                          />
                          
                          <ProcessingOverlay isProcessing={isProcessing} />
                        </div>
                      </LazyWrapper>

                        <div className="flex justify-center">
                          <Button
                            onClick={handleDetect}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                            size="lg"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaEye className="mr-3 h-5 w-5" />
                                Process Image
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
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