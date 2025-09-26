'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaVideo, FaCode, FaUser } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onProfileClick: () => void;
  selectedOption: string;
  onOptionSelect: (option: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, selectedOption, onOptionSelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30); // Reduced threshold for earlier trigger
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const options = [
    { id: 'image', label: 'Image', icon: FaImage },
    { id: 'video', label: 'Video', icon: FaVideo },
    { id: 'api', label: 'API', icon: FaCode },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} // Smoother easing
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        ${isScrolled 
          ? 'border-b border-slate-700 shadow-lg w-full' 
          : 'border-b-0 max-w-7xl mx-auto'
        }
      `}
    >
      <div className={`
        transition-all duration-500 ease-out px-4 sm:px-6 lg:px-8
        ${isScrolled ? 'max-w-none' : 'max-w-7xl mx-auto'}
      `}>
        <div className={`
          flex items-center transition-all duration-500 ease-out
          ${isScrolled ? 'h-14 justify-between' : 'h-16 justify-between'}
        `}>
          
          {/* Left side - Options (when scrolled) or Logo (when not scrolled) */}
          <div className="flex items-center">
            {isScrolled ? (
              <motion.div
                key="scrolled-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex space-x-1"
              >
                {options.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={`left-${option.id}`}
                      layoutId={`option-${option.id}`}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <Button
                        variant={selectedOption === option.id ? 'default' : 'ghost'}
                        onClick={() => onOptionSelect(option.id)}
                        size="sm"
                        className={`
                          flex items-center space-x-1 transition-all duration-300 text-xs
                          ${selectedOption === option.id 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                          }
                        `}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="normal-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.2, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="flex items-center"
              >
                <h1 className="text-2xl font-bold text-white">ProjectKepler</h1>
              </motion.div>
            )}
          </div>

          {/* Center - Logo (when scrolled) or Options (when not scrolled) */}
          <div className="flex items-center">
            {isScrolled ? (
              <motion.div
                key="scrolled-logo"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.2, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="absolute left-1/2 -translate-x-1/2"
              >
                <h1 className="text-xl font-bold text-white">ProjectKepler</h1>
              </motion.div>
            ) : (
              <motion.div
                key="normal-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="flex space-x-1"
              >
                {options.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.div
                      key={`center-${option.id}`}
                      layoutId={`option-${option.id}`}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      <Button
                        variant={selectedOption === option.id ? 'default' : 'ghost'}
                        onClick={() => onOptionSelect(option.id)}
                        className={`
                          flex items-center space-x-2 transition-all duration-300
                          ${selectedOption === option.id 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right side - Profile Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Button
              variant="ghost"
              onClick={onProfileClick}
              size={isScrolled ? "sm" : "default"}
              className="text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300 ease-out"
            >
              <FaUser className={`transition-all duration-300 ${isScrolled ? "h-3 w-3" : "h-4 w-4"}`} />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;