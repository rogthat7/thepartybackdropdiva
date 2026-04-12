import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackdropGallery } from './BackdropGallery';
import { CateringMenuSelector } from './CateringMenuSelector';
import { FireworksBackground } from './FireworksBackground';
import { ConsultationModal } from './ConsultationModal';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'catering'>('gallery');
  const [isConsultationModalOpen, setIsModalOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className={`relative min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-gray-900 text-gray-100 dark' : 'bg-[#fcfcfc] text-gray-900'}`}>
      <FireworksBackground />
      {/* Header */}
      <header className={`relative py-6 border-b shadow-sm sticky top-0 z-50 transition-colors ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-2xl"
              title="Toggle Night Theme"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
            <h1 className="text-2xl font-light tracking-widest uppercase">The Party Backdrop <span className="font-semibold text-gold-500">Diva</span></h1>
          </div>
          <nav className="flex items-center space-x-8 text-sm font-medium tracking-wide">
            <button onClick={() => setActiveTab('gallery')} className={`transition ${activeTab === 'gallery' ? 'text-gold-500' : 'hover:text-gold-500'}`}>Gallery</button>
            <button onClick={() => setActiveTab('catering')} className={`transition ${activeTab === 'catering' ? 'text-gold-500' : 'hover:text-gold-500'}`}>Catering</button>
            {isAdmin && (
              <Link to="/admin" className="text-gold-500 hover:text-gold-600 transition font-bold">Admin</Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-gray-800 pl-8 ml-4">
                <span className="text-gray-400">Hi, {user?.firstName}</span>
                <button onClick={logout} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-full transition shadow-md">Login</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-24 text-center px-4">
        <h2 className="text-5xl md:text-6xl font-light mb-6">Elevate Your Next Event</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">Luxury backdrops and premium catering services designed to create unforgettable experiences.</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium tracking-wide transition shadow-lg hover:shadow-xl"
        >
          Book a Consultation
        </button>
      </section>

      {/* Main Content Areas */}
      <main className="relative z-10">
        {activeTab === 'gallery' && <BackdropGallery />}
        {activeTab === 'catering' && <CateringMenuSelector />}
      </main>
      
      {/* Footer */}
      <footer className={`relative z-10 py-12 text-center text-sm transition-colors ${isDark ? 'bg-black text-gray-500' : 'bg-gray-900 text-gray-400'}`}>
        <p>&copy; {new Date().getFullYear()} The Party Backdrop Diva. All rights reserved.</p>
      </footer>

      <ConsultationModal 
        isOpen={isConsultationModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isDark={isDark} 
      />
    </div>
  );
};
