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
import { useAuth } from '@/lib/authContext';
import { signOutUser } from '@/lib/firebaseClient';
import { 
  getUserProfile, 
  updateUserProfile, 
  isUsernameAvailable, 
  UserProfile,
  createUserProfile 
} from '@/lib/firestoreUser';
import SetPasswordModal from './SetPasswordModal';
import ChangePasswordModal from './ChangePasswordModal';

interface ProfileEditProps {
  onBack: () => void;
  onLogout: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onBack, onLogout }) => {
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bio: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
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
  }, [currentUser]);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <FaArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Profile Information</CardTitle>
              <CardDescription className="text-slate-400">
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="bg-slate-700/30 border-slate-600 text-slate-400"
                  />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="text-slate-200">
                    Username <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
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
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="space-y-2"
                >
                  <Label htmlFor="displayName" className="text-slate-200">
                    Display Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your display name"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
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
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="dateOfBirth" className="text-slate-200">
                    Date of Birth <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
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
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-3"
                >
                  <Label className="text-slate-200">
                    Gender <span className="text-red-400">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" className="border-slate-600" />
                      <Label htmlFor="male" className="text-slate-200">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" className="border-slate-600" />
                      <Label htmlFor="female" className="text-slate-200">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" className="border-slate-600" />
                      <Label htmlFor="other" className="text-slate-200">Other</Label>
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
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="address" className="text-slate-200">
                    Address <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 min-h-[100px]"
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
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="bio" className="text-slate-200">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 min-h-[120px]"
                  />
                </motion.div>

                {/* Password Management Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="border-t border-slate-600 pt-6 space-y-3"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Password Management</h3>
                  {userProfile?.hasPassword ? (
                    <Button
                      type="button"
                      onClick={() => setShowChangePasswordModal(true)}
                      variant="outline"
                      className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <FaKey className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">
                        You signed up with Google. Set a password to enable password reset functionality.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setShowSetPasswordModal(true)}
                        variant="outline"
                        className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <FaLock className="mr-2 h-4 w-4" />
                        Set Password
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Actions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="space-y-3"
                >
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
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