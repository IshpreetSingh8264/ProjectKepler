'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaImage, 
  FaVideo, 
  FaCode, 
  FaCog, 
  FaShieldAlt, 
  FaEye,
  FaCube,
  FaSpaceShuttle,
  FaSatellite,
  FaAtom
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar, LazyWrapper, LoadingSpinner } from '@/components/common';
import { ProtectedRoute } from '@/components/auth';
import { useAuth } from '@/lib/authContext';

// Lazy load components
const FloatingParticles = lazy(() => import('@/components/common/FloatingParticles'));

const HomeContent = () => {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [konamiMode, setKonamiMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  // Konami code easter egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = [...keySequence, event.code].slice(-10);
      setKeySequence(newSequence);
      
      if (newSequence.join(',') === konamiCode.join(',')) {
        setKonamiMode(true);
        setTimeout(() => setKonamiMode(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  const getDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (userProfile?.username) return userProfile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'Commander';
  };

  const missionModules = [
    {
      id: 'image',
      title: 'Image Detection',
      description: 'Advanced AI-powered object detection for space station environments',
      icon: FaImage,
      color: 'space-gradient-primary',
      path: '/image',
      status: 'OPERATIONAL',
      category: 'Detection Systems'
    },
    {
      id: 'video',
      title: 'Video Analysis',
      description: 'Real-time video processing and object tracking capabilities',
      icon: FaVideo,
      color: 'space-gradient-secondary',
      path: '/video',
      status: 'IN DEVELOPMENT',
      category: 'Analysis Systems'
    },
    {
      id: 'api',
      title: 'Mission Control',
      description: 'Developer interface for system integration and API access',
      icon: FaCode,
      color: 'space-gradient-accent',
      path: '/developer',
      status: 'OPERATIONAL',
      category: 'Control Systems'
    }
  ];

  const stationObjects = [
    { 
      name: 'Fire Safety Equipment', 
      icon: FaShieldAlt, 
      realImages: 757,
      syntheticImages: 2300,
      secret: 'Guardian flames that protect the void - forged by reality and dreams' 
    },
    { 
      name: 'Space Suit Systems', 
      icon: FaSpaceShuttle, 
      realImages: 152,
      syntheticImages: 2800,
      secret: 'Armor of the cosmos - where few real warriors inspire infinite digital legends' 
    },
    { 
      name: 'Oxygen Cylinders', 
      icon: FaAtom, 
      realImages: 140,
      syntheticImages: 2500,
      secret: 'Life in metallic vessels - breathing hope through synthetic abundance' 
    }
  ];

  return (
    <div className={`min-h-screen space-station-bg relative overflow-hidden ${konamiMode ? 'animate-pulse' : ''}`}>
      {/* Space Grid Background */}
      <div className={`absolute inset-0 space-grid ${konamiMode ? 'opacity-60' : 'opacity-30'} transition-opacity duration-500`}></div>
      
      {/* Konami Mode Secret Message */}
      {konamiMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/90 border border-cyan-400 rounded-lg p-8 text-center"
        >
          <p className="text-cyan-400 text-xl font-mono mb-2">
            🚀 COMMANDER MODE ACTIVATED 🚀
          </p>
          <p className="text-gray-300 text-sm">
            "In space, no one can hear you code..."
          </p>
        </motion.div>
      )}
      
      {/* Floating Particles */}
      <LazyWrapper>
        <Suspense fallback={null}>
          <FloatingParticles />
        </Suspense>
      </LazyWrapper>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-1 h-1 bg-cyan-400 rounded-full"
          animate={{
            x: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <Navbar onProfileClick={handleProfileClick} />
      
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mission Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="relative inline-block mb-6">
                <FaSpaceShuttle className="h-20 w-20 text-blue-400 mx-auto mb-6 space-text-glow" />
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="block text-gray-300 text-2xl md:text-3xl font-normal mb-2">
                  SPACE STATION
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent space-text-glow">
                  PROJECT KEPLER
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-blue-200 mb-6 font-light">
                  AI-Powered Object Detection for Space Station Operations
                </p>
                
                {/* Poetic Mission Statement */}
                <div className="relative mb-6">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-lg md:text-xl text-cyan-300 font-medium italic leading-relaxed space-text-glow"
                  >
                    "Through the <span className="text-blue-400">lens of detection</span>, across the <span className="text-purple-400">spectrum of analysis</span>,
                    <br />
                    into the <span className="text-cyan-400">realm of control</span> — where <span className="text-orange-400">technology awakens</span>."
                  </motion.p>
                  
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.3 }}
                  />
                </div>
                
                <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Advanced synthetic data training platform for critical object detection in space environments. 
                  Train robust AI models to identify Toolboxes, Oxygen Tanks, and Fire Extinguishers.
                  <span className="text-xs text-gray-600 ml-2">// The falcon soars through digital skies</span>
                </p>
              </div>
            </motion.div>

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <div className="inline-flex items-center space-x-3 px-6 py-3 space-card rounded-full">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-300">
                    Mission Status: <span className="text-blue-400 font-semibold">{getDisplayName()}</span> - ACTIVE
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mission Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {missionModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="h-full"
              >
                <Card className="space-card hover:space-glow transition-all duration-300 cursor-pointer group relative overflow-hidden h-full flex flex-col"
                      onClick={() => router.push(module.path)}>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      module.status === 'OPERATIONAL' ? 'bg-green-400 animate-pulse' : 
                      module.status === 'IN DEVELOPMENT' ? 'bg-yellow-400 animate-pulse' : 
                      'bg-red-400'
                    }`}></div>
                    <span className="text-xs text-gray-400 font-mono">{module.status}</span>
                  </div>

                  <CardHeader className="text-center pb-4">
                    <div className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wider">
                      {module.category}
                    </div>
                    
                    <motion.div
                      className={`w-20 h-20 rounded-lg ${module.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                    >
                      {/* Tech Pattern Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <module.icon className="h-10 w-10 text-white relative z-10" />
                    </motion.div>
                    
                    <CardTitle className="text-white text-xl mb-2">{module.title}</CardTitle>
                    <CardDescription className="text-gray-400 leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center pt-0 flex-1 flex flex-col justify-end">
                    <Button 
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(module.path);
                      }}
                    >
                      <span className="mr-2">ACCESS MODULE</span>
                      <FaRocket className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detection Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Mission Critical Objects</h3>
              <p className="text-gray-400">Real-time detection statistics from Falcon simulation environment</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stationObjects.map((object, index) => (
                <motion.div
                  key={object.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="h-full"
                >
                  <Card className="space-card text-center group hover:space-glow transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                    <CardContent className="p-6 flex-1 flex flex-col justify-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <object.icon className="h-8 w-8 text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{object.name}</h4>
                      <div className="space-y-2 mb-3">
                        <div className="text-2xl font-bold text-blue-400 font-mono">
                          {object.realImages} Real
                        </div>
                        <div className="text-xl font-bold text-cyan-400 font-mono">
                          {object.syntheticImages.toLocaleString()} Synthetic
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">Training Dataset</div>
                      
                      {/* Hidden easter egg tooltip */}
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-cyan-300 text-sm italic px-4 text-center">
                          "{object.secret}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission Briefing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center"
          >
            <Card className="space-card max-w-4xl mx-auto relative overflow-hidden">
              {/* Tech Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20"></div>
              </div>
              
              <CardContent className="p-8 relative z-10">
                <FaSatellite className="h-12 w-12 text-blue-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-6">Space Station Hackathon Challenge</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
                  Train robust AI models using synthetic data generated through Blender and Falcon simulation environments. 
                  Develop advanced object detection capabilities for space station environments with critical 
                  safety equipment identification including fire extinguishers, space suits, and oxygen cylinders.
                  <br />
                  <span className="text-sm text-gray-500 italic mt-2 block">
                    Where synthetic dreams become reality, and every pixel holds the key to tomorrow.
                    <span className="text-xs text-gray-700 ml-2">// Blender + Falcon = Digital Universe</span>
                  </span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-2">YOLOv8</div>
                    <div className="text-gray-400">AI Detection Model</div>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">Blender</div>
                    <div className="text-gray-400">3D Synthesis Engine</div>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-purple-400 mb-2">Falcon</div>
                    <div className="text-gray-400">Digital Twin Sim</div>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-bold text-purple-400 mb-2">Real-time</div>
                    <div className="text-gray-400">Object Detection</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <HomeContent />
    </ProtectedRoute>
  );
};

export default HomePage;