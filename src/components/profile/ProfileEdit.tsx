'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaSignOutAlt, FaKey, FaLock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common';
import { useAuth } from '@/lib/authContext';
import { signOutUser } from '@/lib/firebaseClient';
import { 
  getUserProfile, 
  updateUserProfile, 
  isUsernameAvailable, 
  UserProfile,
  createUserProfile 
} from '@/lib/firestoreUser';
import SetPasswordModal from '../modals/SetPasswordModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';

interface ProfileEditProps {
  onBack: () => void;
  onLogout: () => void;
  initialProfile?: UserProfile | null;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onBack, onLogout, initialProfile }) => {
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialProfile || null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bio: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(!initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    // If we already have initialProfile, populate the form immediately
    if (initialProfile) {
      setFormData({
        username: initialProfile.username || '',
        displayName: initialProfile.displayName || '',
        dateOfBirth: initialProfile.dateOfBirth || '',
        gender: initialProfile.gender || '',
        address: initialProfile.address || '',
        bio: initialProfile.bio || '',
      });
      setIsLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        let profile = await getUserProfile(currentUser.uid);
        
        // Create profile if it doesn't exist
        if (!profile) {
          await createUserProfile(currentUser);
          profile = await getUserProfile(currentUser.uid);
        }

        if (profile) {
          setUserProfile(profile);
          setFormData({
            username: profile.username || '',
            displayName: profile.displayName || '',
            dateOfBirth: profile.dateOfBirth || '',
            gender: profile.gender || '',
            address: profile.address || '',
            bio: profile.bio || '',
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setErrors({ general: 'Failed to load profile. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [currentUser, initialProfile]);

  const validateForm = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else {
      // Check username availability
      const isAvailable = await isUsernameAvailable(formData.username, currentUser?.uid);
      if (!isAvailable) {
        newErrors.username = 'Username is already taken';
      }
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSave = async () => {
    if (isSaving || !currentUser) return;

    setIsSaving(true);
    setErrors({});

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setIsSaving(false);
        return;
      }

      await updateUserProfile(currentUser.uid, {
        username: formData.username,
        displayName: formData.displayName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as 'male' | 'female' | 'other',
        address: formData.address,
        bio: formData.bio,
      });

      // Refresh user profile
      const updatedProfile = await getUserProfile(currentUser.uid);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }

      onBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      onLogout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen space-station-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-cyan-300/80 hover:text-cyan-200 hover:bg-slate-800/60 transition-all duration-300 transform hover:scale-105"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Mission Control
              </Button>
              <h1 className="text-xl font-light text-white tracking-wide space-glow-subtle">Astronaut Profile</h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-400/80 hover:text-red-300 hover:bg-slate-800/60 transition-all duration-300 transform hover:scale-105"
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card className="space-card border-cyan-500/20 backdrop-blur-xl bg-slate-900/90 shadow-2xl shadow-cyan-500/10">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl text-white font-light tracking-wide space-glow-subtle">Mission Profile Configuration</CardTitle>
              <CardDescription className="text-cyan-300/70 text-base font-light">
                Update your astronaut credentials and mission parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm"
                  >
                    <p className="text-red-400 text-sm font-light">{errors.general}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-cyan-300/90 font-medium tracking-wide">Mission Contact</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="bg-slate-800/40 border-cyan-500/20 text-cyan-300/60 cursor-not-allowed"
                  />
                  <p className="text-xs text-cyan-400/50 font-light">Primary contact cannot be modified</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="text-cyan-300/90 font-medium tracking-wide">
                    Callsign <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your astronaut callsign"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/50 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="displayName" className="text-cyan-300/90 font-medium tracking-wide">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your full astronaut name"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/50 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  {errors.displayName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.displayName}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="dateOfBirth" className="text-cyan-300/90 font-medium tracking-wide">
                    Mission Birth Date <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  {errors.dateOfBirth && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.dateOfBirth}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-3"
                >
                  <Label className="text-cyan-300/90 font-medium tracking-wide">
                    Crew Classification <span className="text-red-400">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" className="border-cyan-500/40 text-cyan-400" />
                      <Label htmlFor="male" className="text-cyan-300/80 font-light">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" className="border-cyan-500/40 text-cyan-400" />
                      <Label htmlFor="female" className="text-cyan-300/80 font-light">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" className="border-cyan-500/40 text-cyan-400" />
                      <Label htmlFor="other" className="text-cyan-300/80 font-light">Other</Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.gender}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="address" className="text-cyan-300/90 font-medium tracking-wide">
                    Mission Base Location <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your base coordinates and location..."
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/50 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 min-h-[100px]"
                  />
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm"
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="bio" className="text-cyan-300/90 font-medium tracking-wide">Mission Brief (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Document your astronaut experience and mission objectives..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-slate-800/60 border-cyan-500/30 text-white placeholder:text-cyan-400/50 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 min-h-[120px]"
                  />
                </motion.div>

                {/* Security Protocols Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="border-t border-cyan-500/20 pt-6 space-y-3"
                >
                  <h3 className="text-lg font-light text-white mb-4 tracking-wide space-glow-subtle">Security Protocols</h3>
                  {userProfile?.hasPassword ? (
                    <Button
                      type="button"
                      onClick={() => setShowChangePasswordModal(true)}
                      variant="outline"
                      className="w-full bg-slate-800/60 border-cyan-500/30 text-cyan-300 hover:bg-slate-700/60 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <FaKey className="mr-2 h-4 w-4" />
                      Update Access Codes
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-cyan-400/70 font-light">
                        External authentication detected. Establish backup access credentials for enhanced security.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setShowSetPasswordModal(true)}
                        variant="outline"
                        className="w-full bg-slate-800/60 border-cyan-500/30 text-cyan-300 hover:bg-slate-700/60 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <FaLock className="mr-2 h-4 w-4" />
                        Initialize Backup Access
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Mission Controls Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="space-y-3 pt-2"
                >
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium tracking-wide transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none space-glow-subtle"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating Profile...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FaSave className="h-4 w-4" />
                        <span>Confirm Mission Updates</span>
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Password Modals */}
      <SetPasswordModal
        isOpen={showSetPasswordModal}
        onClose={() => setShowSetPasswordModal(false)}
        onSuccess={() => {
          // Refresh user profile to update hasPassword status
          if (currentUser) {
            getUserProfile(currentUser.uid).then(profile => {
              if (profile) setUserProfile(profile);
            });
          }
        }}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={() => {
          // Show success message or handle success state
          console.log('Password updated successfully');
        }}
      />
    </div>
  );
};

export default ProfileEdit;