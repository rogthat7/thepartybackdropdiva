import React, { useState } from 'react';

export const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:5148/api/supportrequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission failed', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-600/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]"></div>

      <div className="max-w-4xl w-full z-10 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-light tracking-[0.2em] uppercase">Contact <span className="font-semibold text-gold-500">Support</span></h1>
          <p className="text-gray-400 text-lg font-light tracking-wide italic">"Excellence is in the details. We are here to perfect yours."</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <section className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
              <h2 className="text-2xl font-medium text-gold-500 mb-6">Connect With Us</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gold-500/20 p-3 rounded-full text-gold-500">📍</div>
                  <div>
                    <h3 className="font-semibold text-white">Our Atelier</h3>
                    <p className="text-gray-400 text-sm">123 Glamour Row, Suite 500<br />Manhattan, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold-500/20 p-3 rounded-full text-gold-500">📞</div>
                  <div>
                    <h3 className="font-semibold text-white">Concierge Phone</h3>
                    <p className="text-gray-400 text-sm">+1 (888) DIVA-PRTY</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gold-500/20 p-3 rounded-full text-gold-500">✉️</div>
                  <div>
                    <h3 className="font-semibold text-white">Email Inquiries</h3>
                    <p className="text-gray-400 text-sm">concierge@thepartybackdropdiva.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-gold-500/20 rounded-3xl bg-gold-500/5 text-center italic text-gray-400">
              "We strive to respond to all inquiries within 24 business hours."
            </div>
          </section>

          {/* Contact Form */}
          <section className="backdrop-blur-2xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-right duration-700">
            <h2 className="text-2xl font-medium text-gold-500 mb-8">Send a Message</h2>
            
            {status === 'success' ? (
                <div className="text-center py-12 space-y-6">
                    <div className="text-6xl animate-bounce">✨</div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-gold-500">Message Delivered</h3>
                        <p className="text-gray-400">Our concierge team has been notified. Check your email for confirmation.</p>
                    </div>
                    <button 
                        onClick={() => setStatus('idle')}
                        className="text-gold-500 font-bold tracking-widest uppercase text-sm border-b-2 border-gold-500 pb-1"
                    >
                        Send Another Inquiry
                    </button>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">First Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" 
                            placeholder="Jane" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                        </div>
                        <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Last Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" 
                            placeholder="Doe" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" 
                            placeholder="jane@example.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subject</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" 
                            placeholder="Event Planning" 
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Message</label>
                        <textarea 
                            required
                            rows={4} 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors resize-none" 
                            placeholder="How can we elevate your event?"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        ></textarea>
                    </div>

                    {status === 'error' && (
                        <p className="text-red-400 text-sm">Failed to deliver message. Please try again later.</p>
                    )}

                    <button 
                        disabled={status === 'loading'}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-gold-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
                    </button>
                </form>
            )}
          </section>
        </div>

        <footer className="text-center pt-8">
            <button 
                onClick={() => window.location.href = '/'}
                className="text-gray-500 hover:text-gold-500 transition-colors text-sm uppercase tracking-widest font-medium"
            >
                ← Return to Main Entrance
            </button>
        </footer>
      </div>
    </div>
  );
};
