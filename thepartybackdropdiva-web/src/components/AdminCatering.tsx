import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
    type MenuItemDto, 
    type CateringMenuDto, 
    fetchAdminCateringItems, 
    createCateringItem, 
    updateCateringItem, 
    deleteCateringItem,
    fetchAdminCateringMenus,
    createCateringMenu,
    updateCateringMenu,
    deleteCateringMenu,
    uploadFile
} from '../api/apiClient';

export const AdminCatering: React.FC = () => {
    const [items, setItems] = useState<MenuItemDto[]>([]);
    const [menus, setMenus] = useState<CateringMenuDto[]>([]);
    const [activeTab, setActiveTab] = useState<'items' | 'packages'>('items');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<MenuItemDto> | null>(null);
    const [editingMenu, setEditingMenu] = useState<Partial<CateringMenuDto> | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'item' | 'package', name: string } | null>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
                setConfirmDelete(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'items') {
                const data = await fetchAdminCateringItems();
                setItems(data);
            } else {
                const [menuData, itemData] = await Promise.all([
                    fetchAdminCateringMenus(),
                    fetchAdminCateringItems()
                ]);
                setMenus(menuData);
                setItems(itemData);
            }
        } catch (err) {
            toast.error('Failed to load catering data.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isItem: boolean) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            if (isItem) {
                setEditingItem(prev => ({ ...prev, imageUrl: url }));
            } else {
                // Packages don't have images in the current DTO, but could if we want.
                // For now we'll stick to MenuItem images.
            }
            toast.success('Image uploaded successfully.');
        } catch (err) {
            toast.error('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem?.name) return;

        try {
            if (editingItem.id) {
                await updateCateringItem(editingItem.id, editingItem);
                toast.success('Item updated.');
            } else {
                await createCateringItem(editingItem);
                toast.success('Item created.');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to save item.');
        }
    };

    const handleSaveMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMenu?.name) return;

        try {
            if (editingMenu.id) {
                await updateCateringMenu(editingMenu.id, editingMenu);
                toast.success('Package updated.');
            } else {
                await createCateringMenu(editingMenu);
                toast.success('Package created.');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to save package.');
        }
    };

    const handleDeleteItem = (id: string, name: string) => {
        setConfirmDelete({ id, type: 'item', name });
    };

    const handleDeleteMenu = (id: string, name: string) => {
        setConfirmDelete({ id, type: 'package', name });
    };

    const executeDelete = async () => {
        if (!confirmDelete) return;
        try {
            if (confirmDelete.type === 'item') {
                await deleteCateringItem(confirmDelete.id);
                setItems(items.filter(i => i.id !== confirmDelete.id));
                toast.success('Item deleted.');
            } else {
                await deleteCateringMenu(confirmDelete.id);
                setMenus(menus.filter(m => m.id !== confirmDelete.id));
                toast.success('Package deleted.');
            }
        } catch (err) {
            toast.error(`Failed to delete ${confirmDelete.type}.`);
        } finally {
            setConfirmDelete(null);
        }
    };

    const toggleMenuItemInPackage = (itemId: string) => {
        if (!editingMenu) return;
        const currentItems = editingMenu.menuItems || [];
        const exists = currentItems.some(i => i.id === itemId);
        
        let newItems;
        if (exists) {
            newItems = currentItems.filter(i => i.id !== itemId);
        } else {
            const item = items.find(i => i.id === itemId);
            if (item) newItems = [...currentItems, item];
            else newItems = currentItems;
        }
        
        setEditingMenu({ ...editingMenu, menuItems: newItems });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'items' ? 'bg-gold-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gold-500/10'}`}
                    >
                        Food Items
                    </button>
                    <button
                        onClick={() => setActiveTab('packages')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'packages' ? 'bg-gold-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gold-500/10'}`}
                    >
                        Standard Packages
                    </button>
                </div>
                <button
                    onClick={() => {
                        if (activeTab === 'items') {
                            setEditingItem({ name: '', description: '', basePrice: 0, category: 'Mains', isVegetarian: false, isGlutenFree: false });
                            setEditingMenu(null);
                        } else {
                            setEditingMenu({ name: '', description: '', basePricePerPlate: 0, menuItems: [], theme: 'Default' });
                            setEditingItem(null);
                        }
                        setIsModalOpen(true);
                    }}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-2xl text-sm font-bold shadow-xl hover:scale-105 transition-all"
                >
                    Add {activeTab === 'items' ? 'Item' : 'Package'}
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin"></div>
                    <p className="text-gold-500 text-sm font-semibold animate-pulse uppercase tracking-widest">Loading Catering...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'items' ? (
                        items.map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 relative">
                                <div className="absolute top-3 right-3 z-20 flex gap-2">
                                    <button 
                                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                        className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl text-gold-500 hover:bg-gold-500 hover:text-white transition-all"
                                        title="Edit Item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteItem(item.id, item.name)}
                                        className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        title="Delete Item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="h-40 relative overflow-hidden">
                                    <img src={item.imageUrl || 'https://images.unsplash.com/photo-1544025162-811114b0b18d?auto=format&fit=crop&w=400&q=80'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="flex gap-2 w-full">
                                            <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="flex-1 bg-white text-gray-900 py-2 rounded-xl text-xs font-bold hover:bg-gold-500 hover:text-white transition-colors">Edit</button>
                                            <button onClick={() => handleDeleteItem(item.id, item.name)} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                                        <span className="text-gold-500 font-bold">${item.basePrice}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{item.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-lg uppercase tracking-wider">{item.category}</span>
                                        {item.isVegetarian && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">VEG</span>}
                                        {item.isGlutenFree && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">GF</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        menus.map(menu => {
                            return (
                                <div key={menu.id} className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gold-500/20 p-6 hover:border-gold-500 transition-all group relative overflow-hidden">
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button 
                                        onClick={() => { setEditingMenu(menu); setIsModalOpen(true); }}
                                        className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl text-gold-500 hover:bg-gold-500 hover:text-white transition-all"
                                        title="Edit Package"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteMenu(menu.id, menu.name)}
                                        className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        title="Delete Package"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{menu.name}</h4>
                                        <p className="text-gold-500 font-bold">${menu.basePricePerPlate}/plate</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingMenu(menu); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteMenu(menu.id, menu.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{menu.description}</p>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Included Items:</p>
                                    {menu.menuItems.slice(0, 4).map(i => (
                                        <div key={i.id} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-gold-500 rounded-full" />
                                            {i.name}
                                        </div>
                                    ))}
                                    {menu.menuItems.length > 4 && <p className="text-xs text-gold-500 font-bold mt-1">+ {menu.menuItems.length - 4} more...</p>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/10">
                        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingItem ? (editingItem.id ? 'Edit Item' : 'New Item') : (editingMenu?.id ? 'Edit Package' : 'New Package')}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={editingItem ? handleSaveItem : handleSaveMenu} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            {editingItem ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                                            <input required type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</label>
                                            <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none">
                                                <option>Starters</option>
                                                <option>Mains</option>
                                                <option>Desserts</option>
                                                <option>Sides</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                        <textarea required rows={3} value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price ($)</label>
                                            <input required type="number" value={editingItem.basePrice} onChange={e => setEditingItem({ ...editingItem, basePrice: Number(e.target.value) })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none" />
                                        </div>
                                        <div className="flex items-center gap-6 pt-8">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" checked={editingItem.isVegetarian} onChange={e => setEditingItem({ ...editingItem, isVegetarian: e.target.checked })} className="hidden" />
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${editingItem.isVegetarian ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                                    {editingItem.isVegetarian && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-green-500 transition-colors">Vegetarian</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" checked={editingItem.isGlutenFree} onChange={e => setEditingItem({ ...editingItem, isGlutenFree: e.target.checked })} className="hidden" />
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${editingItem.isGlutenFree ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}>
                                                    {editingItem.isGlutenFree && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-amber-500 transition-colors">Gluten Free</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image</label>
                                        <div className="flex gap-4 items-center">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                                                <img src={editingItem.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <input type="file" onChange={e => handleImageUpload(e, true)} className="hidden" id="item-upload" />
                                                <label htmlFor="item-upload" className={`cursor-pointer inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gold-500 hover:text-white transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    {isUploading ? 'Uploading...' : 'Change Image'}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : editingMenu && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Package Name</label>
                                            <input required type="text" value={editingMenu.name} onChange={e => setEditingMenu({ ...editingMenu, name: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Base Price / Plate ($)</label>
                                            <input required type="number" value={editingMenu.basePricePerPlate} onChange={e => setEditingMenu({ ...editingMenu, basePricePerPlate: Number(e.target.value) })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                        <textarea required rows={2} value={editingMenu.description} onChange={e => setEditingMenu({ ...editingMenu, description: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none resize-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Visual Theme Template</label>
                                        <select 
                                            value={editingMenu.theme || 'Default'} 
                                            onChange={e => setEditingMenu({ ...editingMenu, theme: e.target.value })} 
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-gold-500/50 outline-none"
                                        >
                                            <option value="Default">Default Luxury (Gold)</option>
                                            <option value="Christmas">Christmas Spirit (Red & Green)</option>
                                            <option value="Halloween">Halloween Spook (Orange & Purple)</option>
                                            <option value="Easter">Easter Pastel (Blue & Pink)</option>
                                            <option value="Diwali">Diwali Festival (Saffron & Yellow)</option>
                                            <option value="Lunar">Lunar New Year (Crimson & Gold)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Items for this Package</label>
                                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-100 dark:border-gray-800 rounded-2xl">
                                            {items.map(item => {
                                                const isSelected = editingMenu.menuItems?.some(i => i.id === item.id);
                                                return (
                                                    <div 
                                                        key={item.id} 
                                                        onClick={() => toggleMenuItemInPackage(item.id)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-gold-500/10 border-gold-500/20 border' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-gold-500 border-gold-500' : 'border-gray-300'}`}>
                                                            {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                                <button type="submit" className="flex-1 bg-gold-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-gold-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                                    Save {editingItem ? 'Item' : 'Package'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 p-10 text-center space-y-6">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                You are about to delete <span className="font-bold text-gray-900 dark:text-white">"{confirmDelete.name}"</span>. 
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={executeDelete}
                                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95"
                            >
                                Yes, Delete It
                            </button>
                            <button 
                                onClick={() => setConfirmDelete(null)}
                                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                            >
                                No, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
