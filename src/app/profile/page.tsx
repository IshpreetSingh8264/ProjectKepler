'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common';
import { ProfileEdit, ProfileForm } from '@/components/profile';
import { PageTransition } from '@/components/common';
import { useAuth } from '@/lib/authContext';
import { getUserProfile, UserProfile } from '@/lib/firestoreUser';

const ProfilePage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        // If no profile exists, show the ProfileForm
        if (!profile) {
          setShowEdit(false);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (!loading) {
      loadUserProfile();
    }
  }, [user, loading]);

  const handleProfileClick = () => {
    // Already on profile page, toggle edit mode
    if (userProfile) {
      setShowEdit(!showEdit);
    }
  };

  const handleProfileComplete = () => {
    // Reload profile after completion
    if (user) {
      getUserProfile(user.uid).then(profile => {
        setUserProfile(profile);
        setShowEdit(false);
      });
    }
  };

  const handleBackFromEdit = () => {
    setShowEdit(false);
    // Reload profile to get latest data
    if (user) {
      getUserProfile(user.uid).then(profile => {
        setUserProfile(profile);
      });
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  if (loading || profileLoading) {
    return (
      <PageTransition pageKey="profile">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Navbar onProfileClick={handleProfileClick} />
          <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition pageKey="profile">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Only show navbar if not editing (ProfileEdit has its own header) */}
        {!showEdit && <Navbar onProfileClick={handleProfileClick} />}
        
        <div className={!showEdit ? "container mx-auto px-4 py-8 pt-24" : ""}>
          {!userProfile ? (
            // No profile exists, show ProfileForm
            <ProfileForm onComplete={handleProfileComplete} />
          ) : showEdit ? (
            // Profile exists and editing, show ProfileEdit
            <ProfileEdit 
              onBack={handleBackFromEdit}
              onLogout={handleLogout}
            />
          ) : (
            // Profile exists and viewing, show profile info
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <button
                  onClick={() => setShowEdit(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Email</label>
                        <p className="text-white text-lg">{user?.email}</p>
                      </div>
                      {userProfile.username && (
                        <div>
                          <label className="text-slate-400 text-sm">Username</label>
                          <p className="text-white text-lg">@{userProfile.username}</p>
                        </div>
                      )}
                      {userProfile.displayName && (
                        <div>
                          <label className="text-slate-400 text-sm">Display Name</label>
                          <p className="text-white text-lg">{userProfile.displayName}</p>
                        </div>
                      )}
                      {userProfile.dateOfBirth && (
                        <div>
                          <label className="text-slate-400 text-sm">Date of Birth</label>
                          <p className="text-white">{new Date(userProfile.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      )}
                      {userProfile.gender && (
                        <div>
                          <label className="text-slate-400 text-sm">Gender</label>
                          <p className="text-white capitalize">{userProfile.gender}</p>
                        </div>
                      )}
                      {userProfile.address && (
                        <div>
                          <label className="text-slate-400 text-sm">Address</label>
                          <p className="text-white">{userProfile.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Bio</h2>
                    <p className="text-slate-300 leading-relaxed">
                      {userProfile.bio || 'No bio provided yet.'}
                    </p>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Profile Complete</span>
                          <span className="text-green-400 text-sm">✓ Yes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Password Set</span>
                          <span className={`text-sm ${userProfile.hasPassword ? 'text-green-400' : 'text-yellow-400'}`}>
                            {userProfile.hasPassword ? '✓ Yes' : '⚠ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;