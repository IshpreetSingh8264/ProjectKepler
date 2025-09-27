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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            ProjectKepler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400"
          >
            {isLogin ? 'Welcome back' : 'Join us today'}
          </motion.p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {isLogin ? 'Enter your credentials to access your account' : 'Fill in the details to create your account'}
            </CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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
                    <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GoogleLogo />
                  <span className="ml-3">{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={switchMode}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthForm;