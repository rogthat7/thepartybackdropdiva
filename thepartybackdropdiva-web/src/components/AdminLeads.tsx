import React, { useEffect, useState } from 'react';
import { type AdminConsultationRequest, getAllConsultations, updateConsultationStatus, deleteConsultationRequest } from '../services/ConsultationService';

export const AdminLeads: React.FC = () => {
    const [leads, setLeads] = useState<AdminConsultationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

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

    if (loading) return <div className="p-8 text-center text-gold-500 animate-pulse">Loading Leads...</div>;

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-light mb-2">Consultation <span className="font-semibold text-gold-500">Leads</span></h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage incoming requests and follow up with potential clients.</p>
                </div>
                <button 
                    onClick={fetchLeads}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Refresh List"
                >
                    🔄
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Message</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                <td className="px-6 py-4 text-sm">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{lead.email || 'No Email'}</div>
                                    <div className="text-xs text-gray-500">{lead.phone || 'No Phone'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={lead.message}>
                                    {lead.message || <span className="italic opacity-50">No message</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-gold-500 transition-colors cursor-pointer
                                            ${lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : 
                                              lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' : 
                                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button 
                                        onClick={() => handleDelete(lead.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Delete Lead"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {leads.length === 0 && (
                    <div className="p-12 text-center text-gray-500 italic">
                        No consultation requests found.
                    </div>
                )}
            </div>
        </div>
    );
};
