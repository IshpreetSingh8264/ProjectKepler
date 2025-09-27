'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, PageTransition, LoadingSpinner, LazyWrapper } from '@/components/common';
import { useAuth } from '@/lib/authContext';
import { UserProfile } from '@/lib/firestoreUser';

// Lazy load components
const ProfileForm = lazy(() => import('@/components/profile/ProfileForm'));

const ProfilePage = () => {
  const router = useRouter();
  const { user, userProfile, loading, refreshUserProfile } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const handleProfileClick = () => {
    // Already on profile page, toggle edit mode
    // if (userProfile) {
    //   setShowEdit(!showEdit);
    // }
  };

  const handleProfileComplete = async () => {
    // Reload profile after completion
    await refreshUserProfile();
    setShowEdit(false);
  };

  const handleBackFromEdit = async () => {
    setShowEdit(false);
    // Reload profile to get latest data
    await refreshUserProfile();
  };

  const handleLogout = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  }

  // If no user after auth is complete, redirect
  if (!user && initialized) {
    router.push('/');
    return null;
  }

  return (
    <PageTransition pageKey="profile">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Only show navbar if not editing (ProfileEdit has its own header) */}
        {!showEdit && <Navbar onProfileClick={handleProfileClick} />}
        
        <div className={!showEdit ? "container mx-auto px-4 py-8 pt-24" : ""}>
          {!userProfile ? (
            // No profile exists, show ProfileForm
            <LazyWrapper>
              <Suspense fallback={<LoadingSpinner message="Loading form..." />}>
                <ProfileForm onComplete={handleProfileComplete} />
              </Suspense>
            </LazyWrapper>
          ) : showEdit ? (
            // Profile exists and editing, show ProfileEdit (no lazy wrapper needed since we have data)
            <ProfileEdit 
              onBack={handleBackFromEdit}
              onLogout={handleLogout}
              initialProfile={userProfile}
            />
          ) : (
            // Profile exists and viewing, show profile info
            <div className="max-w-4xl mx-auto">{/* Profile content remains the same */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
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