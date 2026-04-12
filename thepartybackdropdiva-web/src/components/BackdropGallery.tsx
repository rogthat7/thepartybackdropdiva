import React, { useEffect, useState } from 'react';
import type { BackdropThemeDto } from '../api/apiClient';
import { fetchBackdrops } from '../api/apiClient';

export const BackdropGallery: React.FC = () => {
    const [backdrops, setBackdrops] = useState<BackdropThemeDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBackdrops().then(data => {
            setBackdrops(data);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to load backdrops', err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading luxury backdrops...</div>;

    return (
        <section className="p-8 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 tracking-tight">Curated Backdrop Collection</h2>
                <div className="w-24 h-1 bg-gold-500 mx-auto mt-4 rounded"></div>
            </div>
            
            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {backdrops.map(bg => (
                    <div key={bg.id} className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800">
                        {/* Placeholder image logic since real images might not exist locally */}
                        <div className="bg-gray-200 dark:bg-gray-700 aspect-[3/4] w-full flex items-center justify-center text-gray-400">
                            {bg.imageUrl ? <img src={bg.imageUrl} alt={bg.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" /> : 'No Image'}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-white text-2xl font-semibold mb-1">{bg.name}</h3>
                            <p className="text-gray-200 text-sm mb-3">{bg.style} | {bg.dimensions}</p>
                            <p className="text-gold-500 font-medium">Starting at ${bg.basePrice}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
