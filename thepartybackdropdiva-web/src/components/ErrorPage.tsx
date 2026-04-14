import React from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6 relative overflow-hidden font-sans text-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 via-gray-900 to-black"></div>
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px]"></div>

      <div className="z-10 max-w-xl space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="space-y-4">
          <div className="text-gold-500 text-6xl mb-4 animate-pulse">⚡</div>
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase">A Minor <span className="font-semibold text-gold-500">Stage Fright</span></h1>
          <p className="text-gray-400 text-xl font-light italic">
            "We've hit an unexpected glitch in the spotlight. Our team is behind the scenes making things perfect again."
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-1 rounded-full inline-flex gap-2 p-2">
            <button 
                onClick={() => window.location.reload()}
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-gold-500/40"
            >
                Try Again
            </button>
            <Link 
                to="/" 
                className="text-gray-300 hover:text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase transition-all"
            >
                Go Home
            </Link>
        </div>

        <div className="pt-8">
            <p className="text-gray-500 text-sm mb-4 tracking-widest uppercase">Persistent issues?</p>
            <Link 
                to="/support" 
                className="text-gold-500/80 hover:text-gold-500 font-medium underline underline-offset-8 transition-colors"
            >
                Contact Concierge Support
            </Link>
        </div>
      </div>
    </div>
  );
};
