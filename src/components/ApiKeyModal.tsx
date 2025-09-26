'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaTimes, FaKey, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  keyName: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, apiKey, keyName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy API key:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm">
              <CardHeader className="relative">
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-full">
                    <FaKey className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">API Key Generated!</CardTitle>
                    <CardDescription className="text-slate-400">
                      {keyName}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Warning Section */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-1">Important!</h4>
                      <p className="text-yellow-300/90 text-sm">
                        This is the only time you'll see this API key. Copy it now and store it securely. 
                        You won't be able to view it again.
                      </p>
                    </div>
                  </div>
                </div>

                {/* API Key Display */}
                <div className="space-y-2">
                  <label className="text-slate-200 text-sm font-medium">Your API Key</label>
                  <div className="flex space-x-2">
                    <Input
                      value={apiKey}
                      readOnly
                      className="bg-slate-700/50 border-slate-600 text-white font-mono text-sm"
                    />
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className={`px-4 transition-all duration-200 ${
                        copied 
                          ? 'bg-green-600 border-green-500 text-white' 
                          : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                      }`}
                    >
                      <FaCopy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 text-xs"
                    >
                      ✓ Copied to clipboard!
                    </motion.p>
                  )}
                </div>

                {/* Usage Instructions */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">How to use your API key:</h4>
                  <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                    <p className="text-slate-300 text-sm">Include it in your request headers:</p>
                    <div className="bg-slate-900/50 rounded p-3 font-mono text-xs text-slate-300">
                      Authorization: Bearer {apiKey.substring(0, 15)}...
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleClose}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    I've Saved My Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApiKeyModal;