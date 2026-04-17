import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackdropGallery } from './BackdropGallery';
import { CateringMenuSelector } from './CateringMenuSelector';
import { FireworksBackground } from './FireworksBackground';
import { ConsultationModal } from './ConsultationModal';
import { SupportRequests } from './SupportRequests';
import { AdvisorAssignedConsultations } from './AdvisorAssignedConsultations';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './UserMenu';

export const Home: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | 'catering' | 'support_requests' | 'assigned_consultations'>('gallery');
  const [isConsultationModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isSupport, isAdvisor } = useAuth();

  return (
    <div className={`relative min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-gray-900 text-gray-100 dark' : 'bg-[#fcfcfc] text-gray-900'}`}>
      <FireworksBackground />
      {/* Header */}
      <header className={`relative py-6 border-b shadow-sm sticky top-0 z-50 transition-colors ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-light tracking-widest uppercase">The Party Backdrop <span className="font-semibold text-gold-500">Diva</span></h1>
          </div>
          <nav className="flex items-center space-x-8 text-sm font-medium tracking-wide">
            <button onClick={() => setActiveTab('gallery')} className={`transition ${activeTab === 'gallery' ? 'text-gold-500' : 'hover:text-gold-500'}`}>Gallery</button>
            <button onClick={() => setActiveTab('catering')} className={`transition ${activeTab === 'catering' ? 'text-gold-500' : 'hover:text-gold-500'}`}>Catering</button>
            {(isAdmin || isSupport) && (
              <button onClick={() => setActiveTab('support_requests')} className={`transition ${activeTab === 'support_requests' ? 'text-gold-500' : 'hover:text-gold-500'}`}>Support Requests</button>
            )}
            {(isAdmin || isAdvisor) && (
              <button onClick={() => setActiveTab('assigned_consultations')} className={`transition ${activeTab === 'assigned_consultations' ? 'text-gold-500 font-bold' : 'hover:text-gold-500 font-semibold'}`}>Assignments</button>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-gold-500 hover:text-gold-600 transition font-bold">Dashboard</Link>
            )}
            {isAuthenticated && !isAdmin && (
              <Link to="/my-events" className="text-gold-500 hover:text-gold-600 transition">My Events</Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-8 ml-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 hidden md:block">Hi, {user?.firstName}</span>
                <UserMenu isDark={isDark} setIsDark={setIsDark} />
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
        {activeTab === 'support_requests' && <SupportRequests isDark={isDark} />}
        {activeTab === 'assigned_consultations' && <AdvisorAssignedConsultations isDark={isDark} />}
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
