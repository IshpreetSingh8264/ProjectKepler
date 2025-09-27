'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  signUpWithEmailAndPassword, 
  signInWithEmailAndPasswordAuth, 
  signInWithGoogle,
  sendVerificationEmail,
  validateEmail,
  validatePassword
} from '@/lib/firebaseClient';
import { createUserProfile } from '@/lib/firestoreUser';
import { GoogleLogo } from '@/components/auth';

interface AuthFormProps {
  onLoginSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmField, setShowConfirmField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Show confirm password field when user starts typing password in signup mode
  useEffect(() => {
    if (!isLogin && formData.password.length > 0) {
      setShowConfirmField(true);
    } else if (!isLogin && formData.password.length === 0) {
      setShowConfirmField(false);
      setFormData(prev => ({ ...prev, confirmPassword: '' }));
    } else if (isLogin) {
      setShowConfirmField(false);
      setFormData(prev => ({ ...prev, confirmPassword: '' }));
    }
  }, [formData.password, isLogin]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message || 'Password is invalid';
      }
    }

    // Confirm password validation for signup
    if (!isLogin && formData.password) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Handle login
        const userCredential = await signInWithEmailAndPasswordAuth(formData.email, formData.password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
          setErrors({ 
            email: 'Please verify your email before logging in. Check your inbox for the verification link.' 
          });
          return;
        }

        onLoginSuccess();
      } else {
        // Handle signup
        const userCredential = await signUpWithEmailAndPassword(formData.email, formData.password);
        const user = userCredential.user;

        // Create user profile in Firestore
        await createUserProfile(user);

        // Send email verification
        await sendVerificationEmail(user);
        
        setErrors({ 
          email: 'Account created successfully! Please check your email and verify your account before logging in.' 
        });
        
        // Switch to login mode after successful signup
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ email: formData.email, password: '', confirmPassword: '' });
          setErrors({});
        }, 3000);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: 'An account with this email already exists' });
          break;
        case 'auth/weak-password':
          setErrors({ password: 'Password is too weak' });
          break;
        case 'auth/user-not-found':
          setErrors({ email: 'No account found with this email' });
          break;
        case 'auth/wrong-password':
          setErrors({ password: 'Incorrect password' });
          break;
        case 'auth/invalid-email':
          setErrors({ email: 'Invalid email address' });
          break;
        case 'auth/user-disabled':
          setErrors({ email: 'This account has been disabled' });
          break;
        default:
          setErrors({ email: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;

      // Create user profile in Firestore if it doesn't exist
      await createUserProfile(user);

      // Google accounts are automatically verified
      onLoginSuccess();
    } catch (error: any) {
      console.error('Google authentication error:', error);
      
      // Handle specific Google auth errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setErrors({ email: 'Google sign-in was cancelled' });
          break;
        case 'auth/popup-blocked':
          setErrors({ email: 'Popup was blocked. Please allow popups and try again.' });
          break;
        case 'auth/account-exists-with-different-credential':
          setErrors({ email: 'An account already exists with this email using a different sign-in method' });
          break;
        default:
          setErrors({ email: 'Failed to sign in with Google. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    if (isLoading) return;
    
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
    setShowConfirmField(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center space-station-bg p-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping shadow-lg shadow-blue-300/50"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping shadow-lg shadow-cyan-300/50"></div>
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/6 right-1/5 w-3 h-3 border border-cyan-400/60 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/6 w-2 h-2 border border-purple-400/60 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 left-1/3 w-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 right-1/2 w-0.5 h-4 bg-gradient-to-b from-transparent via-blue-400/60 to-transparent animate-pulse"></div>
      </div>
      
      {/* Scanning Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-scan-horizontal"></div>
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-transparent via-cyan-400/80 to-transparent animate-scan-vertical"></div>
      </div>
      
      {/* Connection Status Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-mono">SECURE</span>
        </div>
      </div>
      
      {/* System Status */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm rounded px-2 py-1 border border-cyan-500/30">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
            <span className="text-xs text-cyan-400 font-mono">AUTH SYS</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm rounded px-2 py-1 border border-blue-500/30">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-400 font-mono">FIREBASE</span>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          {/* Mission Code Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-cyan-500/30"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-cyan-400 tracking-wider">MISSION-2025-KEPLER</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2 space-glow relative"
          >
            ProjectKepler
            <div className="absolute -top-2 -right-2 w-3 h-3 border-2 border-cyan-400/60 rounded-full animate-ping"></div>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-cyan-300/80 text-lg font-light tracking-wide mb-2"
          >
            {isLogin ? 'Mission Control Access' : 'Join the Expedition'}
          </motion.p>
          
          {/* Mission Briefing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xs text-cyan-400/60 font-mono tracking-wide"
          >
            {isLogin ? 'AUTHENTICATE FOR SYSTEM ACCESS' : 'INITIALIZE CREW REGISTRATION'}
          </motion.div>
        </div>

        <Card className="space-card border-cyan-500/20 backdrop-blur-xl bg-slate-900/90 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
          {/* Animated Border Glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-gradient-shift"></div>
          <div className="absolute inset-[1px] rounded-lg bg-slate-900/95 backdrop-blur-xl"></div>
          
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 w-1/3 animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <CardHeader className="space-y-3 pb-6">
              {/* Status Row */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">ONLINE</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
              
              <CardTitle className="text-2xl text-center text-white font-light tracking-wide relative">
                {isLogin ? 'Access Control' : 'Mission Registration'}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </CardTitle>
              
              <CardDescription className="text-center text-cyan-300/70 text-base font-light">
                {isLogin ? 'Authenticate your credentials for system access' : 'Initialize your mission profile for space operations'}
              </CardDescription>
              
              {/* Security Level Indicator */}
              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-2 bg-slate-800/60 rounded-full px-3 py-1 border border-green-500/30">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">SECURITY LEVEL: ALPHA</span>
                </div>
              </div>
            </CardHeader>
          <CardContent>
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-cyan-300/90 font-medium tracking-wide flex items-center space-x-2">
                    <span>Mission ID</span>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                  </Label>
                  {formData.email && (
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-400 font-mono">VALID</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="astronaut@kepler.space"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/50 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-cyan-400/60 rounded animate-spin-slow"></div>
                  {formData.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-cyan-300/90 font-medium tracking-wide flex items-center space-x-2">
                    <span>Access Code</span>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                  </Label>
                  {formData.password && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        formData.password.length < 6 ? 'bg-red-400' :
                        formData.password.length < 10 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}></div>
                      <span className={`text-xs font-mono ${
                        formData.password.length < 6 ? 'text-red-400' :
                        formData.password.length < 10 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {formData.password.length < 6 ? 'WEAK' :
                         formData.password.length < 10 ? 'MEDIUM' : 'STRONG'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 pl-10 pr-12"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-cyan-400/60 rounded animate-pulse"></div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/70 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${
                      formData.password.length < 6 ? 'w-1/3 bg-gradient-to-r from-red-500 to-red-400' :
                      formData.password.length < 10 ? 'w-2/3 bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'w-full bg-gradient-to-r from-green-500 to-green-400'
                    }`}></div>
                  </div>
                )}
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {showConfirmField && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="confirmPassword" className="text-cyan-300/90 font-medium tracking-wide">Verify Access Code</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/30 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/70 hover:text-cyan-300 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium tracking-wide transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none space-glow-subtle relative overflow-hidden"
                >
                  {/* Button Scanning Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 border border-white/60 rounded-full animate-pulse"></div>
                      <span>{isLogin ? 'Initialize Access' : 'Register Mission'}</span>
                      <div className="w-2 h-2 border border-white/60 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-cyan-500/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="bg-slate-900 px-4 text-cyan-400/70 font-medium">Alternative Access</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-slate-800/40 hover:bg-slate-700/60 text-white border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
                >
                  <GoogleLogo />
                  <span className="ml-3">{isLoading ? 'Authenticating...' : 'Google Mission Access'}</span>
                </Button>
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={switchMode}
                  disabled={isLoading}
                  className="text-cyan-400/80 hover:text-cyan-300 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLogin ? "Need clearance? Register mission profile" : 'Already registered? Access control'}
                </button>
              </div>
            </motion.form>
          </CardContent>
          
          {/* Footer with System Info */}
          <div className="border-t border-cyan-500/20 p-4 bg-slate-900/60">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">SYS: OPERATIONAL</span>
              </div>
              <div className="text-cyan-400/60">
                v2025.09.27 | KEPLER-AUTH
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">UPLINK: 99.9%</span>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          </div>
        </Card>
        
        {/* Bottom Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-slate-900/60 backdrop-blur-sm rounded-full px-6 py-2 border border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-mono">SECURE CONNECTION</span>
            </div>
            <div className="w-px h-4 bg-cyan-500/30"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              <span className="text-xs text-cyan-400 font-mono">REAL-TIME SYNC</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthForm;