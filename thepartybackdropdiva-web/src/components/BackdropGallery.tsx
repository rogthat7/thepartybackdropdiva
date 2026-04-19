import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

import { 
    fetchBackdropCollections, 
    type BackdropCollectionDto, 
    createBackdropCollection,
    deleteBackdropCollection
} from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faImage, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';

export const BackdropGallery: React.FC = () => {
    const [collections, setCollections] = useState<BackdropCollectionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCollection, setSelectedCollection] = useState<BackdropCollectionDto | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        try {
            const data = await fetchBackdropCollections();
            setCollections(data);
        } catch (err) {
            console.error('Failed to load collections', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBackdropCollection({ name: newCollectionName, description: 'New curated collection.' });
            setNewCollectionName('');
            setShowAddModal(false);
            loadCollections();
        } catch (err) {
            alert('Failed to create collection');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) return;
        try {
            await deleteBackdropCollection(id);
            loadCollections();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="p-16 text-center text-gray-500 dark:text-gray-400 font-light tracking-widest animate-pulse">PREPARING LUXURY COLLECTIONS...</div>;

    return (
        <section className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-extralight text-gray-900 dark:text-gray-100 tracking-tighter mb-4">Curated Portfolio</h2>
                <p className="text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">Explore our exclusive series of high-resolution backdrops, crafted for the most discerning eyes.</p>
                <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-8 opacity-50"></div>
                
                {isAdmin && (
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="mt-12 px-8 py-3 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-2xl text-sm font-medium hover:bg-gold-600 dark:hover:bg-gold-500 transition-all shadow-xl hover:scale-105"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> New Collection
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {collections.map(col => (
                    <div key={col.id} className="group relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                        {/* Image Container */}
                        <div className="aspect-[4/5] overflow-hidden relative">
                            {col.coverImageUrl ? (
                                <img src={col.coverImageUrl} alt={col.name} className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-300">
                                    <FontAwesomeIcon icon={faImage} size="3x" />
                                </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                                <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{col.images?.length || 0} VARIATIONS</span>
                                <h3 className="text-white text-3xl font-light tracking-tight mb-4">{col.name}</h3>
                                <button 
                                    onClick={() => setSelectedCollection(col)}
                                    className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-2xl hover:bg-gold-500 hover:border-gold-500 transition-all duration-300 group/btn"
                                >
                                    Explore Series <FontAwesomeIcon icon={faChevronRight} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>


                        {/* Admin Controls */}
                        {isAdmin && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                    onClick={() => handleDelete(col.id)}
                                    className="w-10 h-10 bg-white/90 dark:bg-gray-900/90 text-red-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox / Series Explorer */}
            {selectedCollection && (
                <div 
                    className="fixed inset-0 z-[60] bg-white/95 dark:bg-gray-900/98 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto no-scrollbar"
                    id="series-explorer-root"
                >
                    {/* Header Controls */}
                    <button 
                        onClick={() => setSelectedCollection(null)}
                        className="fixed top-10 right-10 w-14 h-14 flex items-center justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-500 hover:text-gold-500 hover:scale-110 transition-all z-[80] shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <FontAwesomeIcon icon={faXmark} size="xl" />
                    </button>

                    <div className="max-w-[1800px] mx-auto min-h-screen px-8 md:px-16 pt-32 pb-32">
                        {/* Top Section: Title + Carousel */}
                        <div 
                            className="flex flex-col md:flex-row gap-12 items-start mb-40 h-[70vh]"
                            onWheel={(e) => {
                                // Keep the wheel sync for the hero carousel
                                const carousel = document.querySelector('.luxury-carousel');
                                if (!carousel) return;
                                const nextBtn = carousel.querySelector('.carousel-control-next') as HTMLButtonElement;
                                const prevBtn = carousel.querySelector('.carousel-control-prev') as HTMLButtonElement;
                                if (e.deltaY > 0) nextBtn?.click();
                                else prevBtn?.click();
                            }}
                        >
                            {/* Elegant Title Section */}
                            <div className="w-full md:w-[25%] flex flex-col items-start text-left animate-in slide-in-from-left duration-1000 sticky top-32">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="w-12 h-px bg-gold-500"></span>
                                    <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.5em]">{selectedCollection.name}</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tighter mb-8 whitespace-nowrap">
                                    THE <span className="font-thin italic text-gold-500 mx-2">COMPLETE</span> SERIES
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-light text-lg leading-relaxed max-w-lg mb-12">
                                    {selectedCollection.description}
                                    <br /><br />
                                    <span className="text-xs font-medium uppercase tracking-widest opacity-50 flex items-center gap-2">
                                        <span className="animate-bounce">↓</span> Scroll to explore details
                                    </span>
                                </p>

                                <div className="flex gap-4 items-center">
                                    <div className="text-4xl font-extralight text-gold-500">{selectedCollection.images?.length || 0}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] leading-tight text-gray-400">
                                        Hand-Selected <br />Digital Assets
                                    </div>
                                </div>
                            </div>

                            {/* Immersive Carousel Section */}
                            <div className="w-full md:w-[70%] h-full relative group/carousel">
                                <Carousel 
                                    indicators={true} 
                                    fade={true} 
                                    className="h-full luxury-carousel"
                                    interval={null}
                                    controls={selectedCollection.images?.length > 1}
                                >
                                    {selectedCollection.images?.map((img) => (
                                        <Carousel.Item key={img.id} className="h-[70vh]">
                                            <div className="flex items-center justify-center h-full">
                                                <button 
                                                    onClick={() => {
                                                        const el = document.getElementById(`variation-${img.id}`);
                                                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    }}
                                                    className="relative w-full h-full rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 group cursor-s-resize"
                                                    title="Click to see details"
                                                >
                                                    <img 
                                                        src={img.imageUrl} 
                                                        alt={img.title} 
                                                        className="object-cover w-full h-full transition-transform duration-[3000ms] ease-out group-hover:scale-105" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-white text-xs font-bold uppercase tracking-widest">
                                                            View Details
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                                    <div className="absolute left-12 bottom-12 text-left p-0 mb-0">
                                                        <h3 className="text-white text-5xl md:text-6xl font-extralight tracking-tighter mb-2 animate-in slide-in-from-bottom duration-1000">{img.title}</h3>
                                                        <div className="h-1 w-20 bg-gold-500 mb-6" style={{ transformOrigin: 'left' }}></div>
                                                    </div>
                                                </button>
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                        </div>

                        {/* Sequential Detail View Section */}
                        <div className="space-y-40">
                            <div className="flex flex-col items-center mb-20">
                                <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.5em] mb-4">Deep Archive</span>
                                <h3 className="text-3xl font-thin tracking-widest text-gray-400">DETAIL EXPLORATION</h3>
                                <div className="w-px h-24 bg-gradient-to-b from-gold-500 to-transparent mt-8"></div>
                            </div>

                            {selectedCollection.images?.map((img, index) => (
                                <div 
                                    key={img.id} 
                                    id={`variation-${img.id}`}
                                    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center px-4 md:px-20 animate-in fade-in slide-in-from-bottom-20 duration-1000`}
                                >
                                    <div className="w-full md:w-2/3 rounded-[3rem] overflow-hidden shadow-3xl border border-gray-100 dark:border-gray-800 h-[60vh] relative group/nested">
                                        {img.additionalImageUrls && img.additionalImageUrls.length > 0 ? (
                                            <Carousel 
                                                indicators={true} 
                                                fade={true} 
                                                className="h-full luxury-carousel nested-carousel"
                                                interval={4000}
                                            >
                                                {[img.imageUrl, ...img.additionalImageUrls].map((url, idx) => (
                                                    <Carousel.Item key={idx} className="h-[60vh]">
                                                        <img 
                                                            src={url} 
                                                            alt={`${img.title} view ${idx + 1}`} 
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]"
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img 
                                                src={img.imageUrl} 
                                                alt={img.title} 
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]"
                                            />
                                        )}
                                    </div>

                                    <div className="w-full md:w-1/3 flex flex-col items-start text-left space-y-6">
                                        <span className="text-xs font-black text-gold-500 uppercase tracking-widest">Variation 0{index + 1}</span>
                                        <h4 className="text-5xl font-extralight text-gray-900 dark:text-gray-100 tracking-tighter">{img.title}</h4>
                                        <div className="w-16 h-px bg-gray-300 dark:bg-gray-700"></div>
                                        <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                                            A sophisticated interpretation of the {selectedCollection.name} aesthetic, 
                                            meticulously balanced for high-resolution visual impact. 
                                            This composition emphasizes texture and depth, ensuring a premium environment for your event.
                                        </p>
                                        <button 
                                            onClick={() => {
                                                const root = document.getElementById('series-explorer-root');
                                                root?.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gold-500 transition-colors flex items-center gap-4 group"
                                        >
                                            <span className="group-hover:-translate-y-1 transition-transform italic">Return to Hero</span>
                                            <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700 group-hover:w-12 transition-all"></span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



            {/* Add Collection Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <form onSubmit={handleAddCollection} className="relative bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-light mb-8 text-gray-900 dark:text-gray-100">Initialize New Collection</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Series Title</label>
                                <input 
                                    autoFocus
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-6 py-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gold-500 transition-all"
                                    placeholder="e.g. Victorian Gardens"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="w-full py-5 bg-gold-600 hover:bg-gold-500 text-white font-bold rounded-2xl shadow-xl shadow-gold-500/20 transition-all">
                                Create Collection
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
};

