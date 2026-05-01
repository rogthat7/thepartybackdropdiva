import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { type AdminConsultationRequest, getAllConsultations, updateConsultationStatus, deleteConsultationRequest, getAllBookings, convertConsultationToBooking } from '../services/ConsultationService';
import { AdminFollowUpForm } from './AdminFollowUpForm';
import { type AdvisorDto, getAllAdvisors, assignAdvisor } from '../services/AdvisorService';
import { SupportRequests } from './SupportRequests';
import { AdvisorAssignedConsultations } from './AdvisorAssignedConsultations';
import { AdminCatering } from './AdminCatering';


export const AdminLeads: React.FC = () => {
    const [leads, setLeads] = useState<AdminConsultationRequest[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [advisors, setAdvisors] = useState<AdvisorDto[]>([]);
    const [view, setView] = useState<'leads' | 'bookings' | 'support' | 'assignments' | 'catering'>('leads');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

    useEffect(() => {
        if (view === 'leads') fetchLeads();
        else if (view === 'bookings') fetchBookings();
        
        fetchAdvisors();
    }, [view]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await getAllConsultations();
            setLeads(data);
            setError(null);
        } catch (err) {
            setError('Failed to load consultation leads.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings();
            setBookings(data);
            setError(null);
        } catch (err) {
            setError('Failed to load bookings.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdvisors = async () => {
        try {
            const data = await getAllAdvisors();
            setAdvisors(data);
        } catch (err) {
            console.error('Failed to load advisors');
        }
    };


    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateConsultationStatus(id, newStatus);
            setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await deleteConsultationRequest(id);
            setLeads(leads.filter(lead => lead.id !== id));
            toast.success('Lead deleted successfully.');
        } catch (err) {
            toast.error('Failed to delete lead.');
        }
    };

    const handleAssignAdvisor = async (consultationId: string, advisorId: string) => {
        if (!advisorId) return;
        try {
            await assignAdvisor(consultationId, advisorId);
            fetchLeads(); // Refresh to show assignment
            toast.success('Advisor assigned successfully.');
        } catch (err) {
            toast.error('Failed to assign advisor.');
        }
    };

    const handleConvert = async (id: string) => {
        if (!window.confirm('Convert this consultation into a confirmed event booking?')) return;
        try {
            setLoading(true);
            await convertConsultationToBooking(id);
            toast.success('Successfully converted to event booking!');
            fetchLeads(); // Refresh leads
        } catch (err: any) {
            toast.error(err.message || 'Failed to convert consultation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <Link to="/" className="text-gold-500 hover:text-gold-600 mb-6 inline-flex items-center gap-2 transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-sm font-semibold uppercase tracking-wider">Back to Home</span>
                    </Link>
                    <h2 className="text-3xl font-light mb-4">Administration <span className="font-semibold text-gold-500">Dashboard</span></h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setView('leads')}
                            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                view === 'leads' 
                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/40 scale-105' 
                                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 hover:bg-gold-500/10 hover:text-gold-500 hover:shadow-md'
                            }`}
                        >
                            Leads
                        </button>
                        <button
                            onClick={() => setView('bookings')}
                            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                view === 'bookings' 
                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/40 scale-105' 
                                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 hover:bg-gold-500/10 hover:text-gold-500 hover:shadow-md'
                            }`}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => setView('catering')}
                            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                view === 'catering' 
                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/40 scale-105' 
                                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 hover:bg-gold-500/10 hover:text-gold-500 hover:shadow-md'
                            }`}
                        >
                            Catering
                        </button>
                        <button
                            onClick={() => setView('support')}
                            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                view === 'support' 
                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/40 scale-105' 
                                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 hover:bg-gold-500/10 hover:text-gold-500 hover:shadow-md'
                            }`}
                        >
                            Support Requests
                        </button>
                        <button
                            onClick={() => setView('assignments')}
                            className={`px-6 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                                view === 'assignments' 
                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/40 scale-105' 
                                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 hover:bg-gold-500/10 hover:text-gold-500 hover:shadow-md'
                            }`}
                        >
                            Assignments
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

            <div className="relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/50 dark:bg-gray-950/50 backdrop-blur-[2px] flex items-center justify-center p-8 rounded-2xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
                            <p className="text-gold-500 text-sm font-semibold animate-pulse tracking-widest uppercase">Syncing {view}...</p>
                        </div>
                    </div>
                )}

                {view === 'leads' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gold-500/5 dark:bg-gold-500/10 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gold-600 dark:text-gold-400 border-r border-gray-200 dark:border-gray-700">Contact Info</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gold-600 dark:text-gold-400 border-r border-gray-200 dark:border-gray-700">Event Details</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gold-600 dark:text-gold-400 border-r border-gray-200 dark:border-gray-700">Comments</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gold-600 dark:text-gold-400 border-r border-gray-200 dark:border-gray-700">Assign Advisor</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gold-600 dark:text-gold-400 border-r border-gray-200 dark:border-gray-700">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-gold-600 dark:text-gold-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {leads.map(lead => (
                                    <tr key={lead.id} className="hover:bg-gold-50/30 dark:hover:bg-gold-900/10 transition-colors group">
                                        <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-bold text-gold-500 tracking-wider uppercase">{new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                {lead.name && <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{lead.name}</span>}
                                                <span className="text-xs text-gray-600 dark:text-gray-300">{lead.email || <span className="italic opacity-40">No email</span>}</span>
                                                <span className="text-xs text-gray-500 font-mono">{lead.phone || <span className="italic opacity-40">No phone</span>}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-col gap-1.5 min-w-[160px]">
                                                {lead.eventType && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wider w-12 shrink-0">Type</span>
                                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gold-500/10 px-2 py-0.5 rounded-lg">{lead.eventType}</span>
                                                    </div>
                                                )}
                                                {lead.eventDate && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wider w-12 shrink-0">Date</span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">{new Date(lead.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                )}
                                                {lead.guestCount && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wider w-12 shrink-0">Guests</span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-300">{lead.guestCount}</span>
                                                    </div>
                                                )}
                                                {lead.venueLocation && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-bold text-gold-500 uppercase tracking-wider w-12 shrink-0">Venue</span>
                                                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">{lead.venueLocation}</span>
                                                    </div>
                                                )}
                                                {lead.servicesInterested && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500 text-white self-start mt-0.5">{lead.servicesInterested}</span>
                                                )}
                                                {!lead.eventType && !lead.eventDate && !lead.guestCount && !lead.venueLocation && !lead.servicesInterested && (
                                                    <span className="text-xs italic text-gray-300 dark:text-gray-600">No event details</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 italic border-r border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/20">
                                            {lead.comments || <span className="text-gray-300 dark:text-gray-600">—</span>}
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                                            <select 
                                                onChange={(e) => handleAssignAdvisor(lead.id, e.target.value)}
                                                className="text-[10px] w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded p-1 mb-2"
                                                value={lead.assignedAdvisorId || ""}
                                            >
                                                <option value="">Choose Advisor...</option>
                                                {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                            </select>
                                            {lead.assignedAdvisorName && (
                                                <div className="text-[10px] text-gray-500 italic px-1">
                                                    Currently: <span className="font-semibold text-gold-600">{lead.assignedAdvisorName}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 border-r border-gray-200 dark:border-gray-700">
                                            <div className="relative">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer w-full transition-all duration-300 ${lead.status === 'Pending' ? 'bg-amber-100 border-amber-200 text-amber-800' :
                                                            lead.status === 'Contacted' ? 'bg-blue-100 border-blue-200 text-blue-800' :
                                                            lead.status === 'Assigned' ? 'bg-indigo-100 border-indigo-200 text-indigo-800' :
                                                            lead.status === 'Converted' ? 'bg-purple-100 border-purple-200 text-purple-800' :
                                                                'bg-green-100 border-green-200 text-green-800'
                                                        }`}
                                                >
                                                    <option value="Pending">🕒 Pending</option>
                                                    <option value="Assigned">🤝 Assigned</option>
                                                    <option value="Contacted">📞 Contacted</option>
                                                    <option value="Converted">✨ Converted</option>
                                                    <option value="Completed">✅ Completed</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="p-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="View Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    className="p-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    title="Send Contact Email"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                                {lead.status !== 'Converted' && (
                                                    <button
                                                        onClick={() => handleConvert(lead.id)}
                                                        className="p-2 text-gold-500 bg-gold-50 dark:bg-gold-900/20 rounded-xl hover:bg-gold-500 hover:text-white transition-all shadow-sm"
                                                        title="Convert to Event"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                                                    title="Delete Lead"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {leads.length === 0 && !loading && (
                            <div className="p-20 text-center">
                                <div className="text-5xl mb-4 opacity-20">📭</div>
                                <p className="text-gray-400 font-light italic">No consultation leads found at this time.</p>
                            </div>
                        )}
                    </div>
                )}

                {view === 'bookings' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                                <div className="p-6 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                                    <div>
                                        <h4 className="font-semibold text-lg">{booking.customerName}</h4>
                                        <p className="text-sm text-gray-500">{new Date(booking.eventDate).toLocaleDateString()} • {booking.eventLocation}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${booking.status === 'Following Up' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {booking.status}
                                        </span>
                                        <button
                                            onClick={() => setActiveBookingId(activeBookingId === booking.id ? null : booking.id)}
                                            className="text-gold-500 text-sm font-semibold hover:underline"
                                        >
                                            {activeBookingId === booking.id ? 'Close' : 'Add Follow-up'}
                                        </button>
                                    </div>
                                </div>

                                {activeBookingId === booking.id && (
                                    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                                        <AdminFollowUpForm
                                            bookingId={booking.id}
                                            onSuccess={() => {
                                                setActiveBookingId(null);
                                                fetchBookings();
                                            }}
                                            onCancel={() => setActiveBookingId(null)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        {bookings.length === 0 && !loading && <div className="p-12 text-center text-gray-500 italic">No bookings found.</div>}
                    </div>
                )}

                {view === 'support' && (
                    <div className="animate-in fade-in duration-700 -mt-12">
                        <SupportRequests isDark={true} />
                    </div>
                )}

                {view === 'assignments' && (
                    <div className="animate-in fade-in duration-700 -mt-12">
                        <AdvisorAssignedConsultations isDark={true} />
                    </div>
                )}

                {view === 'catering' && (
                    <div className="animate-in fade-in duration-700">
                        <AdminCatering />
                    </div>
                )}
            </div>
        </div>
    );
};
