import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/common';

interface ImageProcessorProps {
  selectedImage: string;
  onProcess: () => void;
  isProcessing: boolean;
  onClear: () => void;
}

const ImageProcessor = ({ 
  selectedImage, 
  onProcess, 
  isProcessing, 
  onClear 
}: ImageProcessorProps) => {
  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden bg-slate-900/50">
        <LazyImage
          src={selectedImage}
          alt="Selected"
          className="w-full h-64 object-contain"
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onProcess}
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
  );
};

export default ImageProcessor;