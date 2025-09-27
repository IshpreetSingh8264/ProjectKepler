'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({
  fullScreen = true,
  message = 'Loading your experience...',
  size = 'large'
}: LoadingSpinnerProps) => {
  // Size configurations
  const sizeConfig = {
    small: {
      outerCircle: 'w-12 h-12 border-2',
      innerCircle: 'w-6 h-6 border-2',
      titleSize: 'text-lg',
      messageSize: 'text-sm'
    },
    medium: {
      outerCircle: 'w-16 h-16 border-3',
      innerCircle: 'w-8 h-8 border-2',
      titleSize: 'text-xl',
      messageSize: 'text-base'
    },
    large: {
      outerCircle: 'w-20 h-20 border-4',
      innerCircle: 'w-10 h-10 border-2',
      titleSize: 'text-2xl',
      messageSize: 'text-base'
    }
  };

  const config = sizeConfig[size];

  const spinnerContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center space-y-6"
    >
      {/* Two Circle Spinner */}
      <div
        className={`relative flex items-center justify-center border-none ${config.outerCircle}`}
      >
        {/* Bigger Outer Circle - Rotates Clockwise */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`
              absolute
              inset-0
              border-transparent
              border-t-blue-500
              border-r-blue-400
              rounded-full
              ${config.outerCircle}
    `}
        />

        {/* Smaller Inner Circle - Rotates Counter-Clockwise */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`
      absolute
      border-transparent
      border-b-purple-500
      border-l-purple-400
      rounded-full
      ${config.innerCircle}
    `}
        />
      </div>


      {/* Content */}
      {(size === 'medium' || size === 'large') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-2"
        >
          {size === 'large' && (
            <h2 className={`${config.titleSize} font-bold text-white`}>
              ProjectKepler
            </h2>
          )}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`${config.messageSize} text-slate-400`}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );

  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-8">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;