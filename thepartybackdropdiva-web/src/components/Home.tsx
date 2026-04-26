import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'home' | 'gallery' | 'catering' | 'support_requests' | 'assigned_consultations'>('home');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/gallery') setActiveTab('gallery');
    else if (path === '/catering') setActiveTab('catering');
    else if (path === '/support-requests') setActiveTab('support_requests');
    else if (path === '/') setActiveTab('home');
    
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);


  const [isConsultationModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isSupport, isAdvisor } = useAuth();

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-500 ${isDark ? 'bg-gray-900 text-gray-100 dark' : 'bg-[#fcfcfc] text-gray-900'}`}>
      <FireworksBackground />
      {/* Header */}
      <header className={`relative py-6 border-b shadow-sm sticky top-0 z-50 transition-colors ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-light tracking-widest uppercase">The Party Backdrop <span className="font-semibold text-gold-500">Diva</span></h1>
          </div>
          <nav className="flex items-center gap-8 text-sm font-medium tracking-wide">

            <Link 
              to="/" 
              className={`relative py-2 px-1 transition-all duration-300 group ${
                activeTab === 'home' ? 'text-gold-500' : 'text-gray-500 hover:text-gold-500'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeTab === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>

            <Link 
              to="/gallery" 
              className={`relative py-2 px-1 transition-all duration-300 group ${
                activeTab === 'gallery' ? 'text-gold-500' : 'text-gray-500 hover:text-gold-500'
              }`}
            >
              Gallery
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeTab === 'gallery' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>

            <Link 
              to="/catering" 
              className={`relative py-2 px-1 transition-all duration-300 group ${
                activeTab === 'catering' ? 'text-gold-500' : 'text-gray-500 hover:text-gold-500'
              }`}
            >
              Catering
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeTab === 'catering' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>

            {isSupport && !isAdmin && (
              <Link 
                to="/support-requests" 
                className={`relative py-2 px-1 transition-all duration-300 group ${
                  activeTab === 'support_requests' ? 'text-gold-500' : 'text-gray-500 hover:text-gold-500'
                }`}
              >
                Support Requests
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeTab === 'support_requests' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            )}

            {isAdvisor && !isAdmin && (
              <Link 
                to="/assignments" 
                className={`relative py-2 px-1 transition-all duration-300 group ${
                  activeTab === 'assigned_consultations' ? 'text-gold-500 font-bold' : 'text-gray-500 hover:text-gold-500 font-semibold'
                }`}
              >
                Assignments
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${activeTab === 'assigned_consultations' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-gold-500 hover:text-gold-600 transition font-bold relative group py-2 px-1">
                Dashboard
                <span className="absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 w-0 group-hover:w-full"></span>
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <Link to="/my-events" className="text-gold-500 hover:text-gold-600 transition relative group py-2 px-1">
                My Events
                <span className="absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 w-0 group-hover:w-full"></span>
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-8 ml-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 hidden md:block">Hi, {user?.firstName}</span>
                <UserMenu isDark={isDark} setIsDark={setIsDark} />
              </div>
            ) : (
              <Link to="/login" className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-2xl transition shadow-md hover:shadow-gold-500/20">Login</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="flex-grow">
        {/* Hero - Only visible on Home tab */}
        {activeTab === 'home' && (
          <section className="relative z-10 py-24 text-center px-4">
        <h2 className="text-5xl md:text-6xl font-light mb-6">Elevate Your Next Event</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">Luxury backdrops and premium catering services designed to create unforgettable experiences.</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-2xl font-medium tracking-wide transition shadow-lg hover:shadow-xl"
        >
          Book a Consultation
        </button>
          </section>
        )}

      {/* Main Content Areas */}
      <main className="relative z-10">
        {activeTab === 'gallery' && <BackdropGallery isDark={isDark} />}
        {activeTab === 'catering' && <CateringMenuSelector />}
        {activeTab === 'support_requests' && <SupportRequests isDark={isDark} />}
        {activeTab === 'assigned_consultations' && <AdvisorAssignedConsultations isDark={isDark} />}
      </main>
      </div>
      
      {/* Footer */}
      <footer className={`relative z-10 py-7 text-center text-sm transition-colors ${isDark ? 'bg-black text-gray-500' : 'bg-gray-900 text-gray-400'}`}>
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
