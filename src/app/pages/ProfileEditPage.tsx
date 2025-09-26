// Profile edit page wrapper
'use client';

import ProfileEdit from '@/components/ProfileEdit';

interface ProfileEditPageProps {
  onBack: () => void;
  onLogout: () => void;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ onBack, onLogout }) => {
  return <ProfileEdit onBack={onBack} onLogout={onLogout} />;
};

export default ProfileEditPage;