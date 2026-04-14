import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SupportRequest {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    assignedUserId?: string;
    createdAt: string;
}

export const SupportRequests: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:5148/api/supportrequests', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error('Failed to fetch support requests', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [token]);

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <header className="mb-12">
                <h2 className="text-4xl font-light tracking-widest uppercase mb-4">Support <span className="font-semibold text-gold-500">Queue</span></h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} tracking-wide`}>Manage client inquiries and track concierge assistance.</p>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
                </div>
            ) : (
                <div className={`backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-gray-200'}`}>
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'} text-xs uppercase tracking-[.2em] font-bold`}>
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Subject</th>
                                <th className="px-8 py-6">Message</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.map((request) => (
                                <tr key={request.id} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors group`}>
                                    <td className="px-8 py-6">
                                        <div className="font-medium text-gold-500">{request.name}</div>
                                        <div className="text-sm opacity-50">{request.email}</div>
                                    </td>
                                    <td className="px-8 py-6 font-medium">{request.subject}</td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm opacity-70 line-clamp-2 max-w-md">{request.message}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-sm ${
                                            request.status === 'Pending' 
                                            ? 'bg-gold-500/20 text-gold-500' 
                                            : 'bg-green-500/20 text-green-500'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right text-sm opacity-50 font-mono">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-500 tracking-widest italic uppercase">
                                        The spotlight is clear. No pending inquiries at this moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
