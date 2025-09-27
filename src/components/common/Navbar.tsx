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

  // Simple scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
        w-full transition-all duration-300 ease-out
        ${isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-blue-500/20 shadow-lg' 
          : 'bg-slate-900/80 backdrop-blur-sm'
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between">
          
          {/* Left side - Logo/Brand */}
          <div className="flex items-center space-x-3">
            <FaSpaceShuttle className={`${isScrolled ? 'h-6 w-6' : 'h-8 w-8'} text-blue-400 transition-all duration-300`} />
            <div>
              <h1 className={`${isScrolled ? 'text-lg' : 'text-xl'} font-bold text-white transition-all duration-300`}>
                PROJECT KEPLER
              </h1>
              <div className="text-xs text-gray-400 font-mono">
                SPACE STATION COMMAND
              </div>
            </div>
          </div>

          {/* Center - Navigation Options */}
          <div className="flex items-center space-x-2">
            {options.map((option) => {
              const Icon = option.icon;
              const isActive = pathname === option.path;
              return (
                <Button
                  key={option.id}
                  onClick={() => handleNavigation(option.path)}
                  variant="ghost"
                  size="sm"
                  className={`
                    flex items-center space-x-2 transition-all duration-300 text-xs relative
                    ${isActive 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{option.label}</span>
                  <span className="hidden lg:inline text-xs text-gray-500">
                    {option.category}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={onProfileClick}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FaUser className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;