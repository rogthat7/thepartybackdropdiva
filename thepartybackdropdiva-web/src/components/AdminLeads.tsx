import React, { useEffect, useState } from 'react';
import { type AdminConsultationRequest, getAllConsultations, updateConsultationStatus, deleteConsultationRequest, getAllBookings } from '../services/ConsultationService';
import { AdminFollowUpForm } from './AdminFollowUpForm';

export const AdminLeads: React.FC = () => {
    const [leads, setLeads] = useState<AdminConsultationRequest[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [view, setView] = useState<'leads' | 'bookings'>('leads');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

    useEffect(() => {
        if (view === 'leads') fetchLeads();
        else fetchBookings();
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

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateConsultationStatus(id, newStatus);
            setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await deleteConsultationRequest(id);
            setLeads(leads.filter(lead => lead.id !== id));
        } catch (err) {
            alert('Failed to delete lead.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gold-500 animate-pulse">Loading {view}...</div>;

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-light mb-4">Administration <span className="font-semibold text-gold-500">Dashboard</span></h2>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setView('leads')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${view === 'leads' ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Consultation Leads
                        </button>
                        <button 
                            onClick={() => setView('bookings')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${view === 'bookings' ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Active Bookings
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

            {view === 'leads' ? (
                /* Leads Table (Existing logic, simplified for brevity here but keeping core) */
                <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400">Date/Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400">Message</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-400 mb-1">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                    <div className="text-sm font-medium">{lead.email || lead.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{lead.message}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                        className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full border-none cursor-pointer"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(lead.id)} className="text-red-500 opacity-50 hover:opacity-100">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            <div className="p-6 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                                <div>
                                    <h4 className="font-semibold text-lg">{booking.customerName}</h4>
                                    <p className="text-sm text-gray-500">{new Date(booking.eventDate).toLocaleDateString()} • {booking.eventLocation}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Following Up' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
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
                    {bookings.length === 0 && <div className="p-12 text-center text-gray-500 italic">No bookings found.</div>}
                </div>
            )}
        </div>
    );
};
