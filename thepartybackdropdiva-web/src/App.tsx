
import { useState } from 'react';
import { BackdropGallery } from './components/BackdropGallery';
import { CateringMenuSelector } from './components/CateringMenuSelector';
import { FireworksBackground } from './components/FireworksBackground';

function App() {
  const [isDark, setIsDark] = useState(true);

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
          <nav className="space-x-8 text-sm font-medium tracking-wide">
            <a href="#" className="hover:text-gold-500 transition">Gallery</a>
            <a href="#" className="hover:text-gold-500 transition">Catering</a>
            <a href="#" className="hover:text-gold-500 transition">Inquire</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-24 text-center px-4">
        <h2 className="text-5xl md:text-6xl font-light mb-6">Elevate Your Next Event</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">Luxury backdrops and premium catering services designed to create unforgettable experiences.</p>
        <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full font-medium tracking-wide transition shadow-lg hover:shadow-xl">
          Book a Consultation
        </button>
      </section>

      {/* Main Content Areas */}
      <main className="relative z-10">
        <BackdropGallery />
        <CateringMenuSelector />
      </main>
      
      {/* Footer */}
      <footer className={`relative z-10 py-12 text-center text-sm transition-colors ${isDark ? 'bg-black text-gray-500' : 'bg-gray-900 text-gray-400'}`}>
        <p>&copy; {new Date().getFullYear()} The Party Backdrop Diva. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
