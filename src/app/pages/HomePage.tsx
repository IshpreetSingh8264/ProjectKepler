// Home page wrapper
'use client';

import Home from '@/components/Home';

interface HomePageProps {
  onProfileClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onProfileClick }) => {
  return <Home onProfileClick={onProfileClick} />;
};

export default HomePage;