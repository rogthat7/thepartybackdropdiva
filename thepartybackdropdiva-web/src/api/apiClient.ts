import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Assuming local dev URL for now

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface BackdropThemeDto {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    style: string;
    dimensions: string;
    imageUrl: string;
    setupComplexityInHours: number;
}

export interface MenuItemDto {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    isVegetarian: boolean;
    isGlutenFree: boolean;
}

export interface CateringMenuDto {
    id: string;
    name: string;
    description: string;
    basePricePerPlate: number;
    menuItems: MenuItemDto[];
}

export const fetchBackdrops = async () => {
    const res = await apiClient.get<BackdropThemeDto[]>('/Catalog/backdrops');
    return res.data;
};

export const fetchMenus = async () => {
    const res = await apiClient.get<CateringMenuDto[]>('/Catalog/menus');
    return res.data;
};
