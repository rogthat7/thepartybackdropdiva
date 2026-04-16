import React, { useEffect, useState } from 'react';
import { type AssignedConsultation, getMyAssignedConsultations } from '../services/AdvisorService';

interface Props {
  isDark: boolean;
}

export const AdvisorAssignedConsultations: React.FC<Props> = ({ isDark }) => {
    const [assignedLeads, setAssignedLeads] = useState<AssignedConsultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAssignedLeads();
    }, []);

    const fetchAssignedLeads = async () => {
        try {
            setLoading(true);
            const data = await getMyAssignedConsultations();
            setAssignedLeads(data);
        } catch (err) {
            setError('Failed to load assigned consultations.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-gold-500 animate-pulse">Loading assigned consultations...</div>;

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            <h2 className="text-3xl font-light mb-8">Your <span className="font-semibold text-gold-500">Assignments</span></h2>
            
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedLeads.map(lead => (
                    <div key={lead.id} className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                <h3 className={`font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{lead.email || lead.phone}</h3>
                            </div>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md uppercase">Assigned</span>
                        </div>
                        <div className={`text-sm italic mb-6 line-clamp-3 p-3 rounded-lg border border-dashed ${isDark ? 'text-gray-400 bg-gray-900/50 border-gray-700' : 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            "{lead.comments || 'No specific instructions provided.'}"
                        </div>
                        <div className="flex gap-3 mt-auto">
                            <button className="flex-1 bg-gold-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-gold-600 transition-colors">Record Follow-up</button>
                            <button className={`px-3 rounded-lg text-xs font-bold transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Details</button>
                        </div>
                    </div>
                ))}
                
                {assignedLeads.length === 0 && (
                    <div className="col-span-full py-32 text-center">
                        <div className="text-6xl mb-6 opacity-20">🍃</div>
                        <p className="text-gray-500 font-light italic">You currently have no consultations assigned to you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
