import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGear,
    faHouse,
    faLayerGroup,
    faSliders,
    faFileLines,
    faRightFromBracket,
    faSun,
    faMoon,
    faDesktop,
    faBowlFood,
    faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
    isDark: boolean;
    setIsDark: (isDark: boolean) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isDark, setIsDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { icon: faHouse, label: 'Edit Home', to: '/edit-home' },
        { icon: faLayerGroup, label: 'Edit Gallery', to: '/edit-gallery' },
        { icon: faBowlFood, label: 'Edit Menu', to: '/edit-menu' },
        { icon: faUserGroup, label: 'User Roles', to: '/user-roles' },
    ];

    const preferenceItems = [
        { icon: faSliders, label: 'My preferences & profile', to: '#' },
        { icon: faFileLines, label: 'Documentations', to: '#' },
    ];

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-500 hover:text-gold-500"
                title="Settings"
            >
                <FontAwesomeIcon icon={faGear} className={`text-xl transition-transform duration-500 ${isOpen ? 'rotate-90 text-gold-500' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                    <div className="p-3 space-y-1">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-4 h-4 text-gray-400 group-hover:text-gold-500" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                    <div className="p-3 space-y-1">
                        {preferenceItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-4 h-4 text-gray-400 group-hover:text-gold-500" />
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 rounded-2xl text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors group"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                    {/* Theme Switcher */}
                    <div className="p-3">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl flex items-center justify-between">
                            <button
                                onClick={() => setIsDark(false)}
                                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-xl transition-all ${!isDark ? 'bg-white dark:bg-gray-700 shadow-sm text-gold-500' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <FontAwesomeIcon icon={faSun} className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsDark(true)}
                                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-xl transition-all ${isDark ? 'bg-white dark:bg-gray-700 shadow-sm text-gold-500' : 'text-gray-400 hover:text-gray-300'}`}
                            >
                                <FontAwesomeIcon icon={faMoon} className="w-4 h-4" />
                            </button>
                            <button
                                className="flex-1 flex items-center justify-center py-2 px-3 rounded-xl text-gray-400 hover:text-gray-500"
                                title="System - Coming Soon"
                            >
                                <FontAwesomeIcon icon={faDesktop} className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>

                    {/* Profile Section */}
                    <div className="p-4 flex items-center gap-4 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="relative">
                            <img
                                src="https://ui-avatars.com/api/?name=Admin&background=B8860B&color=fff"
                                alt="User"
                                className="w-10 h-10 rounded-full border-2 border-gold-500 shadow-lg"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                {user?.firstName} {user?.lastName}
                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-gold-500/10 text-gold-600 font-bold uppercase tracking-tighter">Admin</span>
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{user?.email}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
