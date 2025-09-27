// Design System Constants for ProjectKepler

export const BRAND_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
} as const;

export const GRADIENTS = {
  primary: 'from-blue-600 to-purple-600',
  primaryHover: 'from-blue-700 to-purple-700',
  secondary: 'from-purple-600 to-pink-600',
  secondaryHover: 'from-purple-700 to-pink-700',
  success: 'from-green-600 to-blue-600',
  successHover: 'from-green-700 to-blue-700',
  warning: 'from-orange-600 to-red-600',
  warningHover: 'from-orange-700 to-red-700',
  background: 'from-slate-900 via-slate-800 to-slate-900',
  backgroundAlt: 'from-slate-800 via-slate-700 to-slate-800',
  text: 'from-blue-400 via-purple-500 to-blue-600',
} as const;

export const ANIMATIONS = {
  // Consistent timing functions
  easing: {
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    spring: [0.175, 0.885, 0.32, 1.275],
  },
  
  // Duration constants
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.75,
  },
  
  // Common animation variants for Framer Motion
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    
    scaleUp: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 },
    },
  },
  
  // Stagger animations
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },
} as const;

export const SPACING = {
  // Consistent spacing scale
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
  '5xl': '8rem',  // 128px
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
} as const;

// Component-specific design tokens
export const COMPONENTS = {
  button: {
    height: {
      sm: '2rem',
      md: '2.25rem',
      lg: '2.5rem',
      xl: '3rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.5rem 1rem',
      lg: '0.75rem 1.5rem',
      xl: '1rem 2rem',
    },
    borderRadius: '0.5rem',
  },
  
  card: {
    borderRadius: '0.75rem',
    padding: '1.5rem',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  
  input: {
    height: '2.5rem',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    background: 'rgba(51, 65, 85, 0.5)',
    border: '1px solid rgb(71, 85, 105)',
  },
  
  navbar: {
    height: '4rem',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropBlur: '12px',
  },
} as const;

// Utility functions
export const getGradientClasses = (variant: keyof typeof GRADIENTS) => {
  return `bg-gradient-to-r ${GRADIENTS[variant]}`;
};

export const getAnimationConfig = (
  variant: keyof typeof ANIMATIONS.variants,
  duration: keyof typeof ANIMATIONS.duration = 'normal'
) => {
  return {
    ...ANIMATIONS.variants[variant],
    transition: {
      duration: ANIMATIONS.duration[duration],
      ease: ANIMATIONS.easing.smooth,
    },
  };
};

export const getResponsiveTextClass = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl') => {
  const responsiveMap = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl md:text-5xl',
    '4xl': 'text-4xl sm:text-5xl md:text-6xl',
  };
  
  return responsiveMap[size];
};