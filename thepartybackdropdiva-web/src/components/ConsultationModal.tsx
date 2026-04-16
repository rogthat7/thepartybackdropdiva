import React, { useState } from 'react';
import { submitConsultation } from '../services/NotificationService';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, isDark }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) return;
    
    setStatus('loading');
    try {
      await submitConsultation({ email, phone, comments });
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
        setPhone('');
        setComments('');
        onClose();
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl transition-colors duration-300 ${isDark ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-100'}`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Close"
          disabled={status === 'loading'}
        >
          ✕
        </button>
        
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-light mb-2">Request Sent!</h3>
            <p className="text-gray-400">We'll be in touch shortly.</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-light mb-2">Book a Consultation</h3>
            <p className="text-sm text-gray-400 mb-6">Leave us your contact info, and we'll reach out to craft the perfect event for you.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Email Address (Optional)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border`}
                  disabled={status === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Contact Number (Optional)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border`}
                  disabled={status === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Additional Comments</label>
                <textarea 
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Tell us about your event..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors ${isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border resize-none`}
                  disabled={status === 'loading'}
                />
              </div>
              
              {status === 'error' && (
                <p className="text-red-500 text-sm">An error occurred while sending. Please try again.</p>
              )}

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full mt-6 bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-full font-medium tracking-wide transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {status === 'loading' ? 'SENDING...' : 'GO'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
