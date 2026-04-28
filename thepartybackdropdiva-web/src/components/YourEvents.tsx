import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyEvents, type BookingDto } from '../api/apiClient';

export const YourEvents: React.FC = () => {
    const [events, setEvents] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchMyEvents();
                setEvents(data);
            } catch (err) {
                setError('Failed to load your events. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gold-500 animate-pulse text-xl font-light tracking-widest">Loading Your Events...</div>;

    return (
        <div className="max-w-6xl mx-auto px-8 py-20">
            <Link to="/" className="text-gold-500 hover:text-gold-600 mb-8 inline-flex items-center gap-2 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-semibold uppercase tracking-wider">Back to Home</span>
            </Link>
            <header className="mb-16">
                <h1 className="text-4xl font-light tracking-tight mb-4">Your <span className="font-semibold text-gold-500">Events</span></h1>
                <p className="text-gray-500 text-lg max-w-2xl">Track the status of your catering and backdrop inquiries. Our team will provide follow-ups as we progress.</p>
            </header>

            {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl mb-12">
                    {error}
                </div>
            )}

            <div className="grid gap-12">
                {events.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-400 font-light text-xl">You haven't requested any events yet.</p>
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                            <div className="p-8 md:p-12">
                                <div className="flex flex-wrap justify-between items-start gap-6 mb-12">
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">Event Inquiry</div>
                                        <h3 className="text-3xl font-light">{new Date(event.eventDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                                        <p className="text-gray-500 flex items-center gap-2">
                                            <span className="opacity-50 italic">Location:</span> {event.eventLocation}
                                        </p>
                                    </div>
                                    <div className={`px-6 py-2 rounded-2xl text-sm font-semibold tracking-wide border ${
                                        event.status === 'Inquiry' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                        event.status === 'Following Up' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                        'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                        {event.status}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">Activity Timeline</h4>
                                    
                                    <div className="relative pl-8 space-y-10">
                                        {/* Timeline Bar */}
                                        <div className="absolute left-[3px] top-2 bottom-0 w-[1px] bg-gradient-to-b from-gold-500/50 to-transparent"></div>
                                        
                                        {event.followUps.length === 0 ? (
                                            <div className="text-gray-400 italic text-sm font-light">Waiting for initial review from our experts...</div>
                                        ) : (
                                            event.followUps.map((followUp) => (
                                                <div key={followUp.id} className="relative group">
                                                    {/* Node */}
                                                    <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-gold-500 ring-4 ring-white dark:ring-gray-900 transition-all group-hover:scale-125 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <span className="font-bold text-gray-900 dark:text-gray-100">{followUp.adminName}</span>
                                                            <span className="text-gray-400">•</span>
                                                            <span className="text-gray-400">{new Date(followUp.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 group-hover:border-gold-500/30 transition-colors">
                                                            {followUp.note}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                        {/* Initial Request Node */}
                                        <div className="relative group opacity-60">
                                            <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-gray-300 ring-4 ring-white dark:ring-gray-900"></div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-gray-400">Request Submitted</div>
                                                <div className="text-xs text-gray-400">{new Date(event.eventDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
