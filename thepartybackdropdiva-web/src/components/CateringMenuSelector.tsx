import React, { useEffect, useState } from 'react';
import type { CateringMenuDto, MenuItemDto } from '../api/apiClient';
import { fetchMenus, createCustomMenu } from '../api/apiClient';

export const CateringMenuSelector: React.FC = () => {
    const [menus, setMenus] = useState<CateringMenuDto[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState<number>(50);
    const [mode, setMode] = useState<'packages' | 'custom'>('packages');
    
    // Custom builder state: set of selected MenuItem IDs
    const [customSelection, setCustomSelection] = useState<Set<string>>(new Set());
    const [isSavingCustom, setIsSavingCustom] = useState(false);
    
    // Toggle state for viewing items of curated packages
    const [viewItemsPackageId, setViewItemsPackageId] = useState<string | null>(null);

    useEffect(() => {
        fetchMenus().then(data => {
            setMenus(data);
            if (data.length > 0) {
                // Default select the middle package (usually Gold)
                const defaultMenu = data.find(m => m.name.includes('Gold')) || data[0];
                setSelectedMenuId(defaultMenu.id);
            }
        }).catch(err => console.error(err));
    }, []);

    const selectedMenu = menus.find(m => m.id === selectedMenuId);
    
    // Gather all unique items for the custom builder
    const allItemsMap = new Map<string, MenuItemDto>();
    menus.forEach(m => {
        m.menuItems.forEach(item => {
            if (!allItemsMap.has(item.name)) { // avoid exact duplicates across tiers
                allItemsMap.set(item.name, item);
            }
        });
    });
    const allItems = Array.from(allItemsMap.values());

    const toggleCustomItem = (item: MenuItemDto) => {
        const newSelection = new Set(customSelection);
        if (newSelection.has(item.id)) {
            newSelection.delete(item.id);
        } else {
            newSelection.add(item.id);
        }
        setCustomSelection(newSelection);
    };

    const getBasePrice = () => {
        if (mode === 'packages') {
            return selectedMenu?.basePricePerPlate || 0;
        } else {
            let sum = 0;
            allItems.forEach(item => {
                if (customSelection.has(item.id)) sum += item.basePrice;
            });
            return sum;
        }
    };

    const calculateEstimate = () => {
        let tierMultiplier = 1.0;
        if (guestCount >= 200) tierMultiplier = 0.85;
        else if (guestCount >= 100) tierMultiplier = 0.90;
        else if (guestCount >= 50) tierMultiplier = 0.95;
        else if (guestCount < 20) tierMultiplier = 1.2;
        
        return (getBasePrice() * guestCount) * tierMultiplier;
    };

    const handleSaveCustom = async () => {
        if (customSelection.size === 0) return alert('Please select at least one item.');
        setIsSavingCustom(true);
        try {
            const newMenu = await createCustomMenu("My Custom Package", Array.from(customSelection));
            setMenus([...menus, newMenu]);
            setMode('packages');
            setSelectedMenuId(newMenu.id);
            alert('Custom package saved successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to save custom package.');
        } finally {
            setIsSavingCustom(false);
        }
    };

    const renderItemCard = (item: MenuItemDto, selectable: boolean = false) => {
        const isSelected = customSelection.has(item.id);
        return (
            <div 
                key={item.id} 
                onClick={() => selectable && toggleCustomItem(item)}
                className={`group flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border transition-all ${selectable ? 'cursor-pointer hover:shadow-md' : ''} ${selectable && isSelected ? 'border-gold-500 ring-1 ring-gold-500' : 'border-gray-100 dark:border-gray-800'}`}
            >
                <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {/* Placeholder image logic, using item.imageUrl */}
                    <img src={item.imageUrl || `https://images.unsplash.com/photo-1544025162-811114b0b18d?auto=format&fit=crop&w=400&q=80`} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    {selectable && (
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-gold-500 border-gold-500' : 'bg-white/50 border-white'}`}>
                            {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                    )}
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">{item.name}</h4>
                        {selectable && <span className="text-xs font-semibold text-gold-500 ml-2">+${item.basePrice}</span>}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-grow">{item.description}</p>
                    <div className="flex gap-1 mt-2">
                        {item.isVegetarian && <span className="text-[9px] uppercase tracking-wider font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-1.5 py-0.5 rounded">VEG</span>}
                        {item.isGlutenFree && <span className="text-[9px] uppercase tracking-wider font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-1.5 py-0.5 rounded">GF</span>}
                    </div>
                </div>
            </div>
        );
    };

    const renderCategorizedItems = (items: MenuItemDto[], selectable: boolean) => {
        const categories = ['Starters', 'Mains', 'Desserts'];
        return categories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
                <div key={cat} className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{cat}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {catItems.map(item => renderItemCard(item, selectable))}
                    </div>
                </div>
            );
        });
    };

    const getPackageStyle = (name: string, isSelected: boolean) => {
        const baseStyle = "flex-shrink-0 w-64 px-6 py-4 rounded-2xl border-2 text-left transition-all duration-500 relative overflow-hidden ";
        
        if (name.includes("Silver")) {
            if (isSelected) {
                return baseStyle + "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-800 dark:to-slate-900 border-slate-400 shadow-[4px_4px_10px_rgba(0,0,0,0.15),-4px_-4px_10px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.05)] transform scale-[1.02]";
            } else {
                return baseStyle + "border-slate-200 bg-transparent hover:bg-gradient-to-br hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-800 opacity-70 hover:opacity-100 hover:border-slate-400";
            }
        }
        if (name.includes("Gold")) {
            return baseStyle + (isSelected 
                ? "border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] transform scale-[1.02]" 
                : "border-amber-200 bg-transparent hover:border-amber-300 opacity-70 hover:opacity-100");
        }
        if (name.includes("Platinum")) {
            return baseStyle + (isSelected 
                ? "border-slate-500 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-600 via-gray-900 to-black shadow-[0_0_30px_rgba(71,85,105,0.8)] transform scale-[1.05] z-10 ring-1 ring-white/20" 
                : "border-gray-700 bg-transparent hover:border-gray-500 opacity-80 hover:opacity-100");
        }
        
        return baseStyle + (isSelected 
            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-900/10 transform scale-[1.02]" 
            : "border-transparent bg-transparent hover:border-gray-200 dark:hover:border-gray-700 opacity-70 hover:opacity-100");
    };

    const getPackageTextStyle = (name: string, isSelected: boolean) => {
        if (!isSelected && name.includes("Platinum")) return "text-gray-300";
        if (!isSelected && name.includes("Silver")) return "text-slate-800 dark:text-slate-200";
        if (!isSelected) return "text-gray-800 dark:text-gray-200";
        
        if (name.includes("Silver")) return "text-slate-400 [text-shadow:0_0_2px_rgba(148,163,184,0.8)]"; // Silver color on selection
        if (name.includes("Gold")) return "text-amber-900 [text-shadow:0_0_10px_rgba(255,255,255,1),0_0_2px_rgba(255,255,255,1)]";
        if (name.includes("Platinum")) return "text-white [text-shadow:0_0_15px_rgba(255,255,255,0.8),0_0_5px_rgba(255,255,255,0.5)]";
        return "text-gold-600 dark:text-gold-400";
    };

    const getPackageDescStyle = (name: string, isSelected: boolean) => {
        if (!isSelected && name.includes("Platinum")) return "text-gray-500";
        if (!isSelected) return "text-gray-500 dark:text-gray-400";
        
        if (name.includes("Silver")) return "text-slate-600 font-bold";
        if (name.includes("Gold")) return "text-amber-800";
        if (name.includes("Platinum")) return "text-gray-300";
        return "text-gray-500 dark:text-gray-400";
    };

    return (
        <section className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl mt-12 mb-12">
            <h2 className="text-4xl font-light text-center mb-4 dark:text-gray-100">Design Your Event Menu</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">Choose from our curated culinary packages or build a bespoke dining experience tailored precisely to your guests' tastes.</p>
            
            <div className="flex justify-center gap-2 mb-8">
                <button 
                    onClick={() => setMode('packages')}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === 'packages' ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    Curated Packages
                </button>
                <button 
                    onClick={() => setMode('custom')}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === 'custom' ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    Build Custom
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {mode === 'packages' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 hide-scrollbar px-2 items-center">
                                {menus.filter(m => !m.name.includes("Custom Package")).map(m => {
                                    const isSelected = selectedMenuId === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedMenuId(m.id)}
                                            className={getPackageStyle(m.name, isSelected)}
                                        >
                                            {isSelected && m.name.includes("Platinum") && (
                                                <div className="absolute -inset-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 transform translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                                            )}
                                            <h3 className={`text-xl font-bold mb-1 ${getPackageTextStyle(m.name, isSelected)}`}>{m.name}</h3>
                                            <p className={`text-sm font-semibold mb-2 ${getPackageDescStyle(m.name, isSelected)}`}>${m.basePricePerPlate}/plate</p>
                                            <p className={`text-xs max-w-[200px] line-clamp-2 ${getPackageDescStyle(m.name, isSelected)} opacity-80`}>{m.description}</p>
                                        </button>
                                    );
                                })}
                                {menus.filter(m => m.name.includes("Custom Package")).length > 0 && (
                                     <div className="border-l h-16 border-gray-200 dark:border-gray-700 mx-2"></div>
                                )}
                                {menus.filter(m => m.name.includes("Custom Package")).map(m => {
                                    const isSelected = selectedMenuId === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedMenuId(m.id)}
                                            className={getPackageStyle(m.name, isSelected)}
                                        >
                                            <h3 className={`text-lg font-bold mb-1 ${getPackageTextStyle(m.name, isSelected)}`}>{m.name}</h3>
                                            <p className={`text-sm mb-2 ${getPackageDescStyle(m.name, isSelected)}`}>${m.basePricePerPlate}/plate</p>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mt-4">
                                {selectedMenu ? (
                                    <>
                                        <div className="mb-6 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2">{selectedMenu.name} <span className="text-lg text-gold-500 font-semibold ml-2">${selectedMenu.basePricePerPlate}/plate</span></h3>
                                                <p className="text-gray-500 dark:text-gray-400">{selectedMenu.description}</p>
                                            </div>
                                            <button 
                                                onClick={() => setViewItemsPackageId(viewItemsPackageId === selectedMenu.id ? null : selectedMenu.id)}
                                                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                            >
                                                {viewItemsPackageId === selectedMenu.id ? 'Hide Items' : 'View Items'}
                                            </button>
                                        </div>
                                        {viewItemsPackageId === selectedMenu.id && renderCategorizedItems(selectedMenu.menuItems, false)}
                                    </>
                                ) : (
                                    <p className="text-center text-gray-500 py-12">Select a package to view its details.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2">Build Custom Package</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Select individual dishes to craft your perfect menu.</p>
                                </div>
                                <button 
                                    onClick={handleSaveCustom}
                                    disabled={isSavingCustom || customSelection.size === 0}
                                    className="bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                                >
                                    {isSavingCustom ? 'Saving...' : 'Save Package'}
                                </button>
                            </div>
                            {renderCategorizedItems(allItems, true)}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 sticky top-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Event Estimate</h3>
                        
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Guest Count</label>
                                <span className="text-2xl font-light text-gold-500">{guestCount}</span>
                            </div>
                            <input 
                                type="range" 
                                min="10" max="500" step="5"
                                value={guestCount}
                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-gold-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium mt-2">
                                <span>10</span>
                                <span>250</span>
                                <span>500+</span>
                            </div>
                        </div>

                        <div className="space-y-4 py-6 border-t border-b border-gray-100 dark:border-gray-800 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Base Price</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">${getBasePrice().toFixed(2)} / plate</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Subtotal ({guestCount} guests)</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">${(getBasePrice() * guestCount).toFixed(2)}</span>
                            </div>
                            {guestCount >= 50 && (
                                <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                                    <span>Volume Discount</span>
                                    <span>-{((1 - (calculateEstimate() / (getBasePrice() * guestCount))) * 100).toFixed(0)}%</span>
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-2">Estimated Total</p>
                            <div className="text-5xl font-light text-gray-900 dark:text-white tracking-tight">
                                ${calculateEstimate().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-gray-400 mt-4">*Final price subject to tax, staffing, and setup fees.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
