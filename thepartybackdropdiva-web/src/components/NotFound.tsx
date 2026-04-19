import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px]"></div>

      <div className="text-center z-10 max-w-lg space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          <h1 className="text-[12rem] font-black text-white/5 tracking-tighter leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-1 w-24 bg-gold-500 rounded-full blur-[2px] animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-light tracking-[0.15em] uppercase text-gold-500">Lost in the Glamour?</h2>
          <p className="text-gray-400 text-lg font-light leading-relaxed italic">
            "This particular page seems to have stepped out of the spotlight. Even the best performers need a break sometimes."
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link 
            to="/" 
            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-2xl font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-gold-500/40 w-full sm:w-auto text-center"
          >
            Return to Entrance
          </Link>
          <Link 
            to="/support" 
            className="border border-white/20 hover:border-gold-500/50 hover:text-gold-500 text-gray-300 px-8 py-3 rounded-2xl font-bold tracking-widest uppercase transition-all w-full sm:w-auto text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
