import React, { useEffect, useState } from 'react';
import type { CateringMenuDto } from '../api/apiClient';
import { fetchMenus } from '../api/apiClient';

export const CateringMenuSelector: React.FC = () => {
    const [menus, setMenus] = useState<CateringMenuDto[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState<number>(50);

    useEffect(() => {
        fetchMenus().then(data => setMenus(data)).catch(err => console.error(err));
    }, []);

    const selectedMenu = menus.find(m => m.id === selectedMenuId);
    
    // Tiered calculation mirror from PricingEngine logic
    const calculateEstimate = () => {
        if (!selectedMenu) return 0;
        let tierMultiplier = 1.0;
        if (guestCount >= 200) tierMultiplier = 0.85;
        else if (guestCount >= 100) tierMultiplier = 0.90;
        else if (guestCount >= 50) tierMultiplier = 0.95;
        else if (guestCount < 20) tierMultiplier = 1.2;
        
        return (selectedMenu.basePricePerPlate * guestCount) * tierMultiplier;
    };

    return (
        <section className="p-8 max-w-5xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-inner mt-12 mb-12 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-light text-center mb-8 dark:text-gray-100">Design Your Event Menu</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Package</label>
                        <select 
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-gold-500 focus:border-gold-500 dark:bg-gray-700 dark:text-white"
                            onChange={(e) => setSelectedMenuId(e.target.value)}
                            value={selectedMenuId || ''}
                        >
                            <option value="" disabled>-- Choose a package --</option>
                            {menus.map(m => (
                                <option key={m.id} value={m.id}>{m.name} (${m.basePricePerPlate}/plate)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guest Count: {guestCount}</label>
                        <input 
                            type="range" 
                            min="10" max="500" step="5"
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            className="w-full accent-gold-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>10</span>
                            <span>250</span>
                            <span>500+</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center transition-colors">
                    <p className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm mb-2">Real-time Estimate</p>
                    <div className="text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
                        ${calculateEstimate().toFixed(2)}
                    </div>
                    {guestCount >= 100 && (
                        <span className="inline-block bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium">
                            Volume Discount Applied
                        </span>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">*Final price subject to tax and setup fees.</p>
                </div>
            </div>
        </section>
    );
};
