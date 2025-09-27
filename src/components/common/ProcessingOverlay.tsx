'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingOverlayProps {
  isProcessing: boolean;
}

const ProcessingOverlay = ({ isProcessing }: ProcessingOverlayProps) => {
  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/40 to-slate-900/80 backdrop-blur-sm flex items-center justify-center"
        >
          {/* Scanning Lines */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              animate={{
                y: [0, '100vh'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
              animate={{
                x: [0, '100vw'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <motion.div
            className="text-center relative z-10"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Enhanced Processing Icon */}
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-6"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-full border-4 border-white border-t-transparent"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>

            <div className="text-white text-xl font-semibold mb-2">
              AI Analysis in Progress
            </div>
            <div className="text-cyan-300 text-sm mb-4 font-mono">
              Scanning for space station objects...
            </div>
            
            {/* Enhanced Progress Dots */}
            <div className="flex space-x-2 justify-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProcessingOverlay;