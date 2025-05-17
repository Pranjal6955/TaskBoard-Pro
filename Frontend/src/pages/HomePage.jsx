import React from 'react';
import HomeNavbar from '../components/ui/HomeNavbar';
import HeroSection from '../components/home/HeroSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <HomeNavbar />
      <HeroSection />
    </div>
  );
};

export default HomePage;
