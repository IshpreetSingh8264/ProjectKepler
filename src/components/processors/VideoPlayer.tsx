import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  onProcess: () => void;
  isProcessing: boolean;
  className?: string;
}

const VideoPlayer = ({ 
  src, 
  onProcess, 
  isProcessing, 
  className = '' 
}: VideoPlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative rounded-lg overflow-hidden bg-slate-900/50">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
          </div>
        )}
        
        <video
          ref={videoRef}
          src={src}
          controls
          className={`w-full h-64 transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadedData={handleLoadedData}
          preload="metadata"
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
              <FaPlay className="mr-3 h-5 w-5" />
              Process Video
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;