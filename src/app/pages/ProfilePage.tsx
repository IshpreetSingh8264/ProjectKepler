// Profile completion page wrapper
'use client';

import { ProfileForm } from '@/components/pages/profile';

interface ProfilePageProps {
  onComplete: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onComplete }) => {
  return <ProfileForm onComplete={onComplete} />;
};

export default ProfilePage;