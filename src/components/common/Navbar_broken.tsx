'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaImage, 
  FaVideo, 
  FaCode, 
  FaUser, 
  FaHome, 
  FaSpaceShuttle,
  FaEye,
  FaCog,
  FaRocket
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Optimized scroll handling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const options = [
    { id: 'home', label: 'Command', icon: FaHome, path: '/home', category: 'BRIDGE' },
    { id: 'image', label: 'Detection', icon: FaEye, path: '/image', category: 'SENSORS' },
    { id: 'video', label: 'Analysis', icon: FaVideo, path: '/video', category: 'SYSTEMS' },
    { id: 'developer', label: 'Control', icon: FaCog, path: '/developer', category: 'TECH' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav
      className={`
        w-full transition-all duration-500 ease-out navbar-particle-trail
        ${isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-blue-500/20 shadow-lg space-glow' 
          : 'bg-transparent'
        }
      `}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        width: '100%'
      }}
    >
      <div className={`
        transition-all duration-500 ease-out px-4 sm:px-6 lg:px-8
        ${isScrolled ? 'max-w-none' : 'max-w-7xl mx-auto'}
      `}>
        <div className="flex items-center h-16 justify-between transition-all duration-500 ease-out">
          
          {/* Left side - Options (when scrolled) or Logo (when not scrolled) */}
          <div className="flex items-center">
            {isScrolled ? (
              <motion.div
                key="scrolled-options"
                initial={{ 
                  opacity: 0, 
                  x: scrollDirection === 'down' ? -20 : 20,
                  scale: 0.95 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: 1 
                }}
                exit={{ 
                  opacity: 0, 
                  x: scrollDirection === 'up' ? -20 : 20,
                  scale: 0.95 
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="flex space-x-2"
              >
                {options.map((option, index) => {
                  const Icon = option.icon;
                  const isActive = pathname === option.path;
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
                        variant="ghost"
                        onClick={() => handleNavigation(option.path)}
                        size="sm"
                        className={`
                          flex items-center space-x-2 transition-all duration-300 text-xs relative overflow-hidden
                          ${isActive 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                          }
                        `}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                            layoutId="active-bg"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <Icon className="h-4 w-4 relative z-10" />
                        <span className="hidden md:inline relative z-10">{option.label}</span>
                        <span className="hidden lg:inline text-xs text-gray-500 relative z-10">
                          {option.category}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="normal-logo"
                initial={{ 
                  opacity: 0, 
                  y: scrollDirection === 'up' ? -10 : 10,
                  scale: 0.9 
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1 
                }}
                exit={{ 
                  opacity: 0, 
                  y: scrollDirection === 'down' ? -10 : 10,
                  scale: 0.9 
                }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }}
                className="flex items-center space-x-3"
              >
                <FaSpaceShuttle className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white space-text-glow">PROJECT KEPLER</h1>
                  <div className="text-xs text-gray-400 font-mono">SPACE STATION COMMAND</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Center - Logo (when scrolled) or Options (when not scrolled) */}
          <div className="flex items-center">
            {isScrolled ? (
              <motion.div
                key="scrolled-logo"
                initial={{ 
                  opacity: 0, 
                  y: scrollDirection === 'down' ? 15 : -15, 
                  scale: 0.8,
                  rotateX: scrollDirection === 'down' ? 15 : -15
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateX: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  y: scrollDirection === 'up' ? 15 : -15,
                  rotateX: scrollDirection === 'up' ? 15 : -15
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.1, 
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 150,
                  damping: 20
                }}
                className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2"
                style={{ perspective: '1000px' }}
              >
                <FaRocket className="h-5 w-5 text-blue-400" />
                <h1 className="text-xl font-bold text-white">KEPLER</h1>
              </motion.div>
            ) : (
              <motion.div
                key="normal-options"
                initial={{ 
                  opacity: 0,
                  y: scrollDirection === 'up' ? -20 : 20,
                  scale: 0.9
                }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0,
                  y: scrollDirection === 'down' ? -20 : 20,
                  scale: 0.9
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 180,
                  damping: 22
                }}
                className="flex space-x-3"
              >
                {options.map((option, index) => {
                  const Icon = option.icon;
                  const isActive = pathname === option.path;
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
                        variant="ghost"
                        onClick={() => handleNavigation(option.path)}
                        className={`
                          flex flex-col items-center space-y-1 p-4 transition-all duration-300 relative overflow-hidden
                          ${isActive 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                          }
                        `}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                            layoutId="active-bg"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <Icon className="h-5 w-5 relative z-10" />
                        <span className="text-sm font-medium relative z-10">{option.label}</span>
                        <span className="text-xs text-gray-500 font-mono relative z-10">
                          {option.category}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right side - Profile Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400 font-mono">SYSTEM ACTIVE</span>
            </div>
            
            <Button
              variant="ghost"
              onClick={onProfileClick}
              size={isScrolled ? "sm" : "default"}
              className={`
                transition-all duration-300 ease-out relative overflow-hidden
                ${isScrolled 
                  ? 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }
              `}
            >
              <FaUser className={`transition-all duration-300 ${isScrolled ? "h-4 w-4" : "h-5 w-5"}`} />
              {!isScrolled && (
                <span className="ml-2 text-sm font-mono">PROFILE</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;