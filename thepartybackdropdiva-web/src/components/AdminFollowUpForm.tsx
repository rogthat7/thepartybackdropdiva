import React, { useState } from 'react';
import { addBookingFollowUp } from '../api/apiClient';

interface AdminFollowUpFormProps {
    bookingId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AdminFollowUpForm: React.FC<AdminFollowUpFormProps> = ({ bookingId, onSuccess, onCancel }) => {
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await addBookingFollowUp(bookingId, note);
            setNote('');
            onSuccess();
        } catch (err) {
            setError('Failed to add follow-up. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gold-500/20 shadow-lg animate-in slide-in-from-top duration-300">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold-500 mb-4">Add Follow-up Note</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter details about your conversation with the client..."
                    className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-gold-500 text-sm font-light leading-relaxed resize-none"
                    disabled={isSubmitting}
                />
                
                {error && (
                    <div className="text-xs text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !note.trim()}
                        className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Follow-up'}
                    </button>
                </div>
            </form>
        </div>
    );
};
