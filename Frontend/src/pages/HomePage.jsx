import React from 'react';
import Navbar from '../components/ui/Navbar';
import HeroSection from '../components/home/HeroSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default HomePage;
