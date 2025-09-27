'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

const FloatingParticles = () => {
  // Generate random space particles (stars, debris, etc.)
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 6 + 8,
      type: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'debris' : 'signal',
    }));
  }, []);

  const getParticleColor = (type: string) => {
    switch (type) {
      case 'star': return 'bg-blue-400/40';
      case 'debris': return 'bg-gray-400/30';
      case 'signal': return 'bg-cyan-400/50';
      default: return 'bg-blue-400/30';
    }
  };

  const getParticleShape = (type: string) => {
    switch (type) {
      case 'star': return 'rounded-full';
      case 'debris': return 'rounded-sm rotate-45';
      case 'signal': return 'rounded-full';
      default: return 'rounded-full';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${getParticleColor(particle.type)} ${getParticleShape(particle.type)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: particle.type === 'signal' ? [0.3, 1, 0.3] : [0.2, 0.6, 0.2],
            scale: particle.type === 'star' ? [1, 1.5, 1] : [1, 1.1, 1],
            rotate: particle.type === 'debris' ? [0, 360] : 0,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Add some constellation lines */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute bg-blue-400/20"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
            width: '100px',
            height: '1px',
            transformOrigin: 'left center',
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;