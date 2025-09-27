'use client';

import { useState, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaLink, FaEye, FaTrash, FaImage, FaCog, FaChartLine, FaRocket, FaShieldAlt, FaDownload, FaShare, FaHistory, FaSpaceShuttle, FaAtom } from 'react-icons/fa';
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
  const [detectionResults, setDetectionResults] = useState<any[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [confidence, setConfidence] = useState(0.5);
  const [iouThreshold, setIouThreshold] = useState(0.45);
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
          setHasResults(false);
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
        setHasResults(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setSelectedImage(imageUrl.trim());
      setHasResults(false);
    }
  };

  const handleDetect = () => {
    setIsProcessing(true);
    // Simulate detection process
    setTimeout(() => {
      setIsProcessing(false);
      setHasResults(true);
      setDetectionResults([
        { name: 'Fire Extinguisher', confidence: 95.8, color: 'red', icon: FaShieldAlt, bbox: [100, 100, 200, 300] },
        { name: 'Space Suit', confidence: 87.3, color: 'cyan', icon: FaSpaceShuttle, bbox: [300, 50, 150, 400] },
        { name: 'Oxygen Cylinder', confidence: 92.1, color: 'green', icon: FaAtom, bbox: [500, 200, 100, 250] }
      ]);
    }, 3000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageUrl('');
    setIsProcessing(false);
    setHasResults(false);
    setDetectionResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen space-station-bg relative overflow-hidden">
      {/* Space Grid Background */}
      <div className="absolute inset-0 space-grid opacity-20"></div>
      
      <Navbar onProfileClick={handleProfileClick} />
      
      {/* Page Header */}
      <div className="relative top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20 mt-16">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <FaEye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Object Detection Lab</h1>
                <p className="text-sm text-gray-400">Space Station Critical Equipment Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-xs">YOLOv8</span>
              </div>
              <Button
                onClick={clearImage}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/20 h-8 px-3 text-xs"
                disabled={!selectedImage}
              >
                <FaTrash className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-r border-cyan-500/20 p-6 space-y-6 min-h-screen overflow-y-auto custom-scrollbar">
          {/* Upload Section */}
          <Card className="space-card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaUpload className="h-5 w-5 text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Image Input</h3>
              </div>

              {/* Compact Upload Area */}
              <motion.div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer mb-4 ${
                  isDragOver 
                    ? 'border-cyan-400 bg-cyan-400/10' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUpload className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300 mb-2">Drop image or click</p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF • Max 10MB</p>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* URL Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="Image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-slate-800/50 border-blue-500/20 text-white placeholder:text-gray-500 focus:border-cyan-400 text-sm"
                  />
                  <Button
                    onClick={handleUrlSubmit}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 px-3"
                    disabled={!imageUrl.trim()}
                  >
                    Load
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Detection Controls */}
          <Card className="space-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaCog className="h-5 w-5 text-cyan-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Detection</h3>
                </div>
                {selectedImage && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>

              {!selectedImage ? (
                <div className="text-center py-8">
                  <FaImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No image selected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Detection Button */}
                  <Button
                    onClick={handleDetect}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 text-base font-semibold"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FaRocket className="h-4 w-4 mr-2" />
                        Start Detection
                      </>
                    )}
                  </Button>

                  {/* Advanced Parameters */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Confidence
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.05"
                          value={confidence}
                          onChange={(e) => setConfidence(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                        />
                        <div className="text-xs text-cyan-400 text-center mt-1">{Math.round(confidence * 100)}%</div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          IoU Threshold
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="0.9"
                          step="0.05"
                          value={iouThreshold}
                          onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                        />
                        <div className="text-xs text-purple-400 text-center mt-1">{Math.round(iouThreshold * 100)}%</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Model Variant
                      </label>
                      <select className="w-full bg-slate-800/50 border border-blue-500/20 text-white text-xs rounded px-2 py-1">
                        <option value="yolov8n">YOLOv8 Nano (Fast)</option>
                        <option value="yolov8s">YOLOv8 Small</option>
                        <option value="yolov8m">YOLOv8 Medium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Target Objects
                      </label>
                      <div className="space-y-1">
                        {['Fire Extinguisher', 'Space Suit', 'Oxygen Cylinder'].map((obj) => (
                          <label key={obj} className="flex items-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-300 text-xs">{obj}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Stats Panel */}
          <Card className="space-card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaChartLine className="h-5 w-5 text-green-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Analysis Stats</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Model</span>
                  <span className="text-blue-400 font-mono text-sm">YOLOv8n</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Input Size</span>
                  <span className="text-purple-400 font-mono text-sm">640x640</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Speed</span>
                  <span className="text-cyan-400 font-mono text-sm">Real-time</span>
                </div>
                {hasResults && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-gray-400 text-sm">Objects Found</span>
                    <span className="text-green-400 font-mono text-sm">{detectionResults.length}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          {hasResults && (
            <Card className="space-card">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaDownload className="h-5 w-5 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Export</h3>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 py-2" size="sm">
                    <FaDownload className="h-3 w-3 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/20 py-2" size="sm">
                    <FaShare className="h-3 w-3 mr-2" />
                    Share Analysis
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            {/* Image Preview */}
            <Card className="space-card">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Image Preview</h3>
                  {selectedImage && (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">Ready</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-slate-800/30 rounded-lg border-2 border-dashed border-gray-600 min-h-[500px] overflow-hidden">
                  {selectedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <LazyImage
                        src={selectedImage}
                        alt="Selected image for detection"
                        className="max-w-full h-auto object-contain rounded-lg shadow-lg"
                      />
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <ProcessingOverlay isProcessing={isProcessing} />
                        </div>
                      )}
                      {/* Detection Results Overlay */}
                      {hasResults && !isProcessing && (
                        <div className="absolute inset-0">
                          {detectionResults.map((result, index) => (
                            <div
                              key={index}
                              className={`absolute border-2 border-${result.color}-400 bg-${result.color}-400/20 backdrop-blur-sm`}
                              style={{
                                left: `${(result.bbox[0] / 640) * 100}%`,
                                top: `${(result.bbox[1] / 640) * 100}%`,
                                width: `${(result.bbox[2] / 640) * 100}%`,
                                height: `${(result.bbox[3] / 640) * 100}%`,
                              }}
                            >
                              <div className={`absolute -top-6 left-0 bg-${result.color}-400 text-black px-2 py-1 text-xs font-semibold rounded`}>
                                {result.name} {result.confidence}%
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <FaImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-300 mb-2">No Image Selected</h4>
                      <p className="text-gray-500 text-sm">Upload an image or paste a URL to begin detection</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Results Panel */}
            <Card className="space-card">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Detection Analysis</h3>
                  {hasResults && (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">{detectionResults.length} Objects</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  {!selectedImage ? (
                    <div className="text-center py-20">
                      <FaEye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-300 mb-2">Ready for Analysis</h4>
                      <p className="text-gray-500 text-sm">Select an image to start object detection</p>
                    </div>
                  ) : !hasResults && !isProcessing ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                        <FaRocket className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">Image Loaded</h4>
                      <p className="text-gray-400 text-sm mb-4">Click "Start Detection" to analyze objects</p>
                    </div>
                  ) : isProcessing ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">Analyzing Image</h4>
                      <p className="text-gray-400 text-sm">AI model processing in progress...</p>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-green-400 mb-1">{detectionResults.length}</div>
                        <div className="text-sm text-gray-400">Objects Detected</div>
                      </div>

                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {detectionResults.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="space-card p-4 group hover:space-glow transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${result.color}-500 to-${result.color}-600 flex items-center justify-center mr-3`}>
                                  <result.icon className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium text-white">{result.name}</span>
                              </div>
                              <span className="text-green-400 font-mono font-bold">{result.confidence}%</span>
                            </div>
                            
                            {/* Confidence Bar */}
                            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r from-${result.color}-500 to-${result.color}-400`}
                                initial={{ width: 0 }}
                                animate={{ width: `${result.confidence}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
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