import React, { useState, useEffect } from 'react';
import { submitConsultation } from '../services/NotificationService';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const EVENT_TYPES = ['Wedding', 'Birthday', 'Baby Shower', 'Corporate', 'Anniversary', 'Graduation', 'Other'];
const GUEST_COUNTS = ['Under 50', '50 – 100', '100 – 200', '200 – 500', '500+'];
const SERVICES = ['Backdrops', 'Catering', 'Both'];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, isDark }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [servicesInterested, setServicesInterested] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setComments('');
    setEventType(''); setEventDate(''); setGuestCount('');
    setVenueLocation(''); setServicesInterested('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitConsultation({
        name,
        email,
        phone,
        comments,
        eventType,
        eventDate,
        guestCount,
        venueLocation,
        servicesInterested,
      });
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        resetForm();
        onClose();
      }, 2500);
    } catch (error) {
      setStatus('error');
    }
  };

  const inputBase = `w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200 border text-sm ${
    isDark
      ? 'bg-gray-900/80 border-gray-700 text-white placeholder-gray-600 focus:border-gold-500'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gold-500'
  }`;

  const labelBase = 'block text-xs font-semibold uppercase tracking-widest mb-1.5 opacity-70';

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl my-auto rounded-3xl shadow-2xl transition-colors duration-300 overflow-hidden ${
          isDark
            ? 'bg-gray-800 text-gray-100 border border-gray-700/80'
            : 'bg-white text-gray-900 border border-gray-100'
        }`}
      >
        {/* Header */}
        <div className={`px-8 pt-8 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
              isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
            }`}
            aria-label="Close"
            disabled={status === 'loading'}
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-1">
            <span className="w-8 h-px bg-gold-500 opacity-70"></span>
            <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.25em]">Event Inquiry</span>
          </div>
          <h3 className="text-2xl font-light">Book a <span className="font-semibold text-gold-500">Consultation</span></h3>
          <p className="text-sm text-gray-400 mt-1">Share a few details — all fields are optional. The more you share, the better we can prepare.</p>
        </div>

        {/* Body */}
        <div className="px-8 py-7 max-h-[70vh] overflow-y-auto">
          {status === 'success' ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl animate-bounce">✨</div>
              <h4 className="text-2xl font-light">Request Received!</h4>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">Our team will review your details and reach out shortly to craft your perfect event.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Row 1: Name + Event Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className={inputBase}
                    disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <label className={labelBase}>Event Type</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className={inputBase}
                    disabled={status === 'loading'}
                  >
                    <option value="">Select event type...</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Event Date + Guest Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`${inputBase} ${!eventDate ? 'text-gray-500 dark:text-gray-600' : ''}`}
                    disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <label className={labelBase}>Estimated Guests</label>
                  <select
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    className={inputBase}
                    disabled={status === 'loading'}
                  >
                    <option value="">Approximate guest count...</option>
                    {GUEST_COUNTS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3: Venue */}
              <div>
                <label className={labelBase}>Venue / Location</label>
                <input
                  type="text"
                  value={venueLocation}
                  onChange={e => setVenueLocation(e.target.value)}
                  placeholder="e.g. Manhattan, NY or The Grand Ballroom"
                  className={inputBase}
                  disabled={status === 'loading'}
                />
              </div>

              {/* Services Interested In */}
              <div>
                <label className={labelBase}>Services Interested In</label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {SERVICES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setServicesInterested(prev => prev === s ? '' : s)}
                      disabled={status === 'loading'}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all duration-200 ${
                        servicesInterested === s
                          ? 'bg-gold-500 border-gold-500 text-white shadow-lg shadow-gold-500/30 scale-105'
                          : isDark
                            ? 'bg-gray-900/60 border-gray-600 text-gray-400 hover:border-gold-500 hover:text-gold-500'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gold-500 hover:text-gold-500'
                      }`}
                    >
                      {s === 'Backdrops' ? '🎭 Backdrops' : s === 'Catering' ? '🍽️ Catering' : '✨ Both'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className={`flex items-center gap-4 ${isDark ? 'text-gray-600' : 'text-gray-200'}`}>
                <div className="flex-1 h-px bg-current"></div>
                <span className="text-xs uppercase tracking-widest opacity-60">Contact</span>
                <div className="flex-1 h-px bg-current"></div>
              </div>

              {/* Row 4: Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                    disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <label className={labelBase}>Contact Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={inputBase}
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className={labelBase}>Anything Else?</label>
                <textarea
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Theme ideas, special requests, inspiration references..."
                  rows={3}
                  className={`${inputBase} resize-none`}
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  Something went wrong. Please try again or contact us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-2xl font-semibold tracking-widest uppercase transition-all shadow-lg hover:shadow-gold-500/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {status === 'loading' ? 'Submitting...' : 'Request Consultation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
