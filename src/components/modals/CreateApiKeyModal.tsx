'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateKey: (keyName: string) => Promise<void>;
  isLoading: boolean;
}

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateKey, 
  isLoading 
}) => {
  const [keyName, setKeyName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!keyName.trim()) {
      newErrors.keyName = 'API key name is required';
    } else if (keyName.length < 3) {
      newErrors.keyName = 'API key name must be at least 3 characters';
    } else if (keyName.length > 50) {
      newErrors.keyName = 'API key name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    try {
      await onCreateKey(keyName);
      setKeyName('');
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ keyName: 'Failed to create API key. Please try again.' });
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setKeyName('');
    setErrors({});
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
            className="w-full max-w-md"
          >
            <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm">
              <CardHeader className="relative">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
                <CardTitle className="text-xl text-white flex items-center">
                  <FaPlus className="mr-2 h-5 w-5" />
                  Create New API Key
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Generate a new API key for your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName" className="text-slate-200">
                      API Key Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="keyName"
                      type="text"
                      placeholder="e.g., Production App, Development"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                      disabled={isLoading}
                    />
                    {errors.keyName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm"
                      >
                        {errors.keyName}
                      </motion.p>
                    )}
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-300 text-xs">
                      <strong>Note:</strong> This name is for your reference only. 
                      It will help you identify different API keys in your dashboard.
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !keyName.trim()}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create API Key'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateApiKeyModal;