import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { CateringMenuDto, MenuItemDto } from '../api/apiClient';
import { fetchMenus, createCustomMenu, updateCustomMenu, deleteCustomMenu } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export const CateringMenuSelector: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [menus, setMenus] = useState<CateringMenuDto[]>([]);
    const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
    const [guestCount, setGuestCount] = useState<number>(50);
    const [mode, setMode] = useState<'packages' | 'custom'>('packages');

    // Custom builder state: set of selected MenuItem IDs
    const [customSelection, setCustomSelection] = useState<Set<string>>(new Set());
    const [editingCustomMenuId, setEditingCustomMenuId] = useState<string | null>(null);
    const [isSavingCustom, setIsSavingCustom] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempPackageName, setTempPackageName] = useState('');

    // Toggle state for viewing items of curated packages
    const [viewItemsPackageId, setViewItemsPackageId] = useState<string | null>(null);

    useEffect(() => {
        fetchMenus().then(data => {
            setMenus(data);
            if (data.length > 0 && !selectedMenuId) {
                // Default select the middle package (usually Gold)
                const defaultMenu = data.find(m => m.name.includes('Gold')) || data[0];
                setSelectedMenuId(defaultMenu.id);
            }
        }).catch(err => console.error(err));
    }, [isAuthenticated]);

    useEffect(() => {
        if (editingCustomMenuId) {
            const menu = menus.find(m => m.id === editingCustomMenuId);
            if (menu) {
                setCustomSelection(new Set(menu.menuItems.map(item => item.id)));
                setTempPackageName(menu.name);
            }
        } else {
            setCustomSelection(new Set());
            setTempPackageName('');
        }
    }, [editingCustomMenuId]);

    useEffect(() => {
        if (!isAuthenticated && mode === 'custom') {
            setMode('packages');
        }
    }, [isAuthenticated, mode]);

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
        if (customSelection.size === 0) return toast.error('Please select at least one item.');
        const packageName = tempPackageName.trim() || "My Custom Package";
        setIsSavingCustom(true);
        try {
            if (editingCustomMenuId) {
                const updatedMenu = await updateCustomMenu(editingCustomMenuId, packageName, Array.from(customSelection));
                setMenus(menus.map(m => m.id === editingCustomMenuId ? updatedMenu : m));
                toast.success('Custom package updated successfully!');
            } else {
                const newMenu = await createCustomMenu(packageName, Array.from(customSelection));
                setMenus([...menus, newMenu]);
                setEditingCustomMenuId(newMenu.id);
                toast.success('Custom package saved successfully!');
            }
        } catch (e) {
            console.error(e);
            toast.error(editingCustomMenuId ? 'Failed to update custom package.' : 'Failed to save custom package.');
        } finally {
            setIsSavingCustom(false);
        }
    };

    const handleDeleteCustom = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this custom package?')) return;
        
        try {
            await deleteCustomMenu(id);
            setMenus(menus.filter(m => m.id !== id));
            if (editingCustomMenuId === id) {
                setEditingCustomMenuId(null);
                setCustomSelection(new Set());
            }
            if (selectedMenuId === id) {
                setSelectedMenuId(menus[0]?.id || null);
            }
            toast.success('Custom package deleted.');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete custom package.');
        }
    };

    const handleRenameCustom = async () => {
        if (!editingCustomMenuId || !tempPackageName.trim()) return;
        setIsSavingCustom(true);
        try {
            const updatedMenu = await updateCustomMenu(editingCustomMenuId, tempPackageName, Array.from(customSelection));
            setMenus(menus.map(m => m.id === editingCustomMenuId ? updatedMenu : m));
            setIsEditingName(false);
            toast.success('Package renamed successfully!');
        } catch (e) {
            console.error(e);
            toast.error('Failed to rename package.');
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
                className={`group flex flex-col bg-white dark:!bg-gray-900 rounded-xl overflow-hidden shadow-sm border transition-all ${selectable ? 'cursor-pointer hover:shadow-md' : ''} ${selectable && isSelected ? 'border-gold-500 ring-1 ring-gold-500' : 'border-gray-100 dark:border-gray-800'}`}
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

    const getPackageStyle = (name: string, isSelected: boolean, theme: string = 'Default') => {
        const baseStyle = "w-full px-6 py-4 rounded-2xl border-2 text-left transition-all duration-500 relative overflow-hidden ";

        if (name.includes("Silver")) {
            if (isSelected) {
                return baseStyle + "bg-gradient-to-br from-slate-50 via-slate-200 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.4)] transform scale-[1.02] z-10";
            } else {
                return baseStyle + "border-slate-200 bg-transparent hover:border-slate-300 opacity-70 hover:opacity-100";
            }
        }
        if (name.includes("Gold")) {
            return baseStyle + (isSelected
                ? "border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] transform scale-[1.02]"
                : "border-amber-200 bg-transparent hover:border-amber-300 opacity-70 hover:opacity-100");
        }
        if (name.includes("Platinum")) {
            return baseStyle + (isSelected
                ? "platinum-rgb-border bg-[linear-gradient(110deg,#0f172a,45%,#334155,55%,#0f172a)] bg-[length:200%_100%] animate-[shiny-sweep_3s_linear_infinite] shadow-[0_0_30px_rgba(71,85,105,0.8)] transform scale-[1.05] z-10 ring-1 ring-white/20"
                : "border-gray-700 bg-transparent hover:border-gray-500 opacity-80 hover:opacity-100");
        }

        // Festival Themes
        if (theme === 'Christmas') {
            return baseStyle + (isSelected
                ? "border-red-500 border-4 ring-inset ring-4 ring-green-500/30 bg-red-50/50 dark:bg-red-900/10 shadow-[0_0_25px_rgba(239,68,68,0.5)] transform scale-[1.02] z-10"
                : "border-green-600/40 bg-white dark:bg-gray-900/40 hover:border-red-500 opacity-90 hover:opacity-100");
        }
        if (theme === 'Halloween') {
            return baseStyle + (isSelected
                ? "border-orange-500 border-4 ring-inset ring-4 ring-purple-500/30 bg-orange-50/50 dark:bg-orange-900/10 shadow-[0_0_25px_rgba(249,115,22,0.5)] transform scale-[1.02] z-10"
                : "border-purple-600/40 bg-white dark:bg-gray-900/40 hover:border-orange-500 opacity-90 hover:opacity-100");
        }
        if (theme === 'Easter') {
            return baseStyle + (isSelected
                ? "border-sky-400 border-4 ring-inset ring-4 ring-pink-300/30 bg-sky-50/50 dark:bg-sky-900/10 shadow-[0_0_25px_rgba(56,189,248,0.5)] transform scale-[1.02] z-10"
                : "border-pink-300/40 bg-white dark:bg-gray-900/40 hover:border-sky-400 opacity-90 hover:opacity-100");
        }
        if (theme === 'Diwali') {
            return baseStyle + (isSelected
                ? "border-orange-400 border-4 ring-inset ring-4 ring-yellow-300/30 bg-orange-50/50 dark:bg-orange-900/10 shadow-[0_0_25px_rgba(251,146,60,0.5)] transform scale-[1.02] z-10"
                : "border-yellow-400/40 bg-white dark:bg-gray-900/40 hover:border-orange-400 opacity-90 hover:opacity-100");
        }
        if (theme === 'Lunar') {
            return baseStyle + (isSelected
                ? "border-red-600 border-4 ring-inset ring-4 ring-gold-500/30 bg-red-50/50 dark:bg-red-900/10 shadow-[0_0_25px_rgba(220,38,38,0.5)] transform scale-[1.02] z-10"
                : "border-gold-500/40 bg-white dark:bg-gray-900/40 hover:border-red-600 opacity-90 hover:opacity-100");
        }

        return baseStyle + (isSelected
            ? "border-amber-400 border-4 ring-inset ring-4 ring-white/30 bg-gold-50/50 dark:bg-gold-900/10 shadow-[0_0_25px_rgba(251,191,36,0.5)] transform scale-[1.02] z-10"
            : "border-gold-500/40 bg-white dark:bg-gray-900/40 hover:border-gold-500 opacity-90 hover:opacity-100");
    };

    const getPackageTextStyle = (name: string, isSelected: boolean, theme: string = 'Default') => {
        if (!isSelected && name.includes("Platinum")) return "text-gray-300";
        if (!isSelected && name.includes("Silver")) return "text-slate-800 dark:text-slate-200";
        if (!isSelected && name.includes("Gold")) return "text-amber-800/80";
        
        if (!isSelected) {
            if (theme === 'Christmas') return "text-red-800 dark:text-red-200";
            if (theme === 'Halloween') return "text-orange-800 dark:text-orange-200";
            if (theme === 'Easter') return "text-sky-800 dark:text-sky-200";
            if (theme === 'Diwali') return "text-orange-700 dark:text-orange-300";
            if (theme === 'Lunar') return "text-red-700 dark:text-red-300";
            return "text-gray-800 dark:text-gray-200";
        }

        if (name.includes("Silver")) return "text-slate-900 dark:text-white [text-shadow:0_0_10px_rgba(255,255,255,0.5)]";
        if (name.includes("Gold")) return "!text-[#451a03] [text-shadow:0_0_5px_rgba(255,255,255,1),0_0_10px_rgba(255,255,255,1),0_0_20px_rgba(255,255,255,0.8)]";
        if (name.includes("Platinum")) return "text-white [text-shadow:0_0_15px_rgba(255,255,255,0.8),0_0_5px_rgba(255,255,255,0.5)]";
        
        if (theme === 'Christmas') return "text-red-600 dark:text-red-400 font-black";
        if (theme === 'Halloween') return "text-orange-600 dark:text-orange-400 font-black";
        if (theme === 'Easter') return "text-sky-600 dark:text-sky-400 font-black";
        if (theme === 'Diwali') return "text-orange-500 dark:text-yellow-400 font-black";
        if (theme === 'Lunar') return "text-red-600 dark:text-yellow-500 font-black";
        
        return "text-gold-600 dark:text-gold-400";
    };

    const getPackageDescStyle = (name: string, isSelected: boolean) => {
        if (!isSelected && name.includes("Platinum")) return "text-gray-500";
        if (!isSelected) return "text-gray-500 dark:text-gray-400";

        if (name.includes("Silver")) return "text-slate-700 dark:text-slate-300 font-bold";
        if (name.includes("Gold")) return "text-amber-800";
        if (name.includes("Platinum")) return "text-gray-300";
        return "text-gray-500 dark:text-gray-400";
    };

    return (
        <section className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50/50 dark:!bg-gray-800/30 rounded-3xl mt-12 mb-12">
            <h2 className="text-4xl font-light text-center mb-4 dark:text-gray-100">Design Your Event Menu</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">Choose from our curated culinary packages or build a bespoke dining experience tailored precisely to your guests' tastes.</p>

            <div className="flex justify-center items-center gap-4 mb-8">
                <button
                    onClick={() => setMode('packages')}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === 'packages' ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    Curated Packages
                </button>
                {isAuthenticated ? (
                    <button
                        onClick={() => setMode('custom')}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${mode === 'custom' ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Build Custom
                    </button>
                ) : (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-700 flex items-center bg-white/50 dark:bg-gray-900/50 px-4 py-2 rounded-full shadow-sm">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            <Link to="/login" className="text-gold-500 hover:text-gold-600 font-bold hover:underline transition-all">Login</Link> to customised your menu
                        </p>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {mode === 'packages' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 pt-2 px-2">
                                {menus.filter(m => !m.isCustom).map(m => {
                                    const isSelected = selectedMenuId === m.id;
                                    const isSpecial = !['silver', 'gold', 'platinum'].some(t => m.name.toLowerCase().includes(t));
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => setSelectedMenuId(m.id)}
                                            className={getPackageStyle(m.name, isSelected, m.theme)}
                                        >
                                        {(() => {
                                            const themeName = m.theme && m.theme !== '' ? m.theme : (isSpecial ? 'default' : null);
                                            return themeName ? (
                                                <div 
                                                    className={`absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none ${isSelected ? 'opacity-30' : ''}`}
                                                    style={{ 
                                                        backgroundImage: `url(/images/themes/${themeName.toLowerCase()}.png)`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                            ) : null;
                                        })()}
                                            {isSpecial && (
                                                <div className="diagonal-tag-right">
                                                    <span>{m.theme && m.theme !== 'Default' ? m.theme : 'Special'}</span>
                                                </div>
                                            )}
                                            {isSelected && m.name.includes("Platinum") && (
                                                <div className="absolute -inset-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 transform translate-x-[-100%] animate-[shimmer_3s_infinite] z-10" />
                                            )}
                                            <h3 className={`text-xl font-bold mb-1 ${getPackageTextStyle(m.name, isSelected, m.theme)}`}>{m.name}</h3>
                                            <p className={`text-sm font-semibold mb-2 ${getPackageDescStyle(m.name, isSelected)}`}>${m.basePricePerPlate}/plate</p>
                                            <p className={`text-xs max-w-[200px] line-clamp-2 ${getPackageDescStyle(m.name, isSelected)} opacity-80`}>{m.description}</p>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="bg-white dark:!bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mt-4">
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
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:!bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div className="flex flex-wrap justify-between items-start mb-10 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <h3 className="text-3xl font-light text-gray-900 dark:text-white">Build Custom Package</h3>
                                        
                                        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                                                {isEditingName ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text"
                                                            value={tempPackageName}
                                                            onChange={(e) => setTempPackageName(e.target.value)}
                                                            className="bg-gray-50 dark:bg-gray-800 border border-gold-500 rounded-2xl px-4 py-2 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500/50 outline-none transition-all"
                                                            placeholder="Package Name"
                                                            autoFocus
                                                        />
                                                        <button 
                                                            onClick={handleRenameCustom}
                                                            className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => setIsEditingName(false)}
                                                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="relative">
                                                            <select 
                                                                value={editingCustomMenuId || ""}
                                                                onChange={(e) => setEditingCustomMenuId(e.target.value || null)}
                                                                className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-4 pr-10 py-2.5 text-sm font-bold text-gold-600 dark:text-gold-400 focus:ring-2 focus:ring-gold-500/50 outline-none transition-all cursor-pointer hover:border-gold-500/50"
                                                            >
                                                                <option value="">+ New Custom Package</option>
                                                                {menus.filter(m => m.isCustom).map(m => (
                                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold-500">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        {editingCustomMenuId && (
                                                            <div className="flex items-center gap-1">
                                                                <button 
                                                                    onClick={() => {
                                                                        const m = menus.find(menu => menu.id === editingCustomMenuId);
                                                                        if (m) {
                                                                            setTempPackageName(m.name);
                                                                            setIsEditingName(true);
                                                                        }
                                                                    }}
                                                                    className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 shadow-sm"
                                                                    title="Rename package"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => handleDeleteCustom(e, editingCustomMenuId)}
                                                                    className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-transparent hover:border-red-200 dark:hover:border-red-800/50 shadow-sm"
                                                                    title="Delete this package"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">Craft your perfect menu by selecting individual dishes. Your saved packages can be managed using the dropdown above.</p>
                                </div>
                                <button
                                    onClick={handleSaveCustom}
                                    disabled={isSavingCustom || customSelection.size === 0}
                                    className="bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 border border-gold-500/50 hover:border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] shrink-0"
                                >
                                    {isSavingCustom ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : editingCustomMenuId ? 'Update Package' : 'Save Package'}
                                </button>
                            </div>
                            {renderCategorizedItems(allItems, true)}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:!bg-gray-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 sticky top-8 lg:mt-[158px] mt-0">
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
