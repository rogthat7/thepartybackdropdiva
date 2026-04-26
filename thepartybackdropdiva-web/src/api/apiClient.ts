import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5148/api';

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
    imageUrl?: string;
}

export interface CateringMenuDto {
    id: string;
    name: string;
    description: string;
    basePricePerPlate: number;
    menuItems: MenuItemDto[];
}

export interface BackdropImageDto {
    id: string;
    backdropCollectionId: string;
    imageUrl: string;
    additionalImageUrls?: string[];
    title: string;
}

export interface BackdropCollectionDto {
    id: string;
    name: string;
    description: string;
    coverImageUrl?: string;
    images: BackdropImageDto[];
}

export const fetchBackdrops = async () => {
    const res = await apiClient.get<BackdropThemeDto[]>('/Catalog/backdrops');
    return res.data;
};

export const fetchBackdropCollections = async () => {
    const res = await apiClient.get<BackdropCollectionDto[]>('/BackdropCollections');
    return res.data;
};


export const fetchMenus = async () => {
    const res = await apiClient.get<CateringMenuDto[]>('/Catalog/menus');
    return res.data;
};

export const createCustomMenu = async (name: string, menuItemIds: string[]) => {
    // Determine token for user assignment
    const token = localStorage.getItem('auth_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await apiClient.post<CateringMenuDto>('/Catalog/menus/custom', { name, menuItemIds }, { headers });
    return res.data;
};

// Member Endpoints
export interface FollowUpDto {
    id: string;
    note: string;
    adminName: string;
    createdAt: string;
}

export interface BookingDto {
    id: string;
    customerName: string;
    status: string;
    eventDate: string;
    eventLocation: string;
    followUps: FollowUpDto[];
}

export const fetchMyEvents = async () => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/member/my-events`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json() as Promise<BookingDto[]>;
};

// Admin Endpoints
// Admin Backdrop Collection Endpoints
export const createBackdropCollection = async (dto: Partial<BackdropCollectionDto>) => {
    const token = localStorage.getItem('auth_token');
    const res = await apiClient.post<BackdropCollectionDto>('/BackdropCollections', dto, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
};

export const updateBackdropCollection = async (id: string, dto: Partial<BackdropCollectionDto>) => {
    const token = localStorage.getItem('auth_token');
    await apiClient.put(`/BackdropCollections/${id}`, dto, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const deleteBackdropCollection = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    await apiClient.delete(`/BackdropCollections/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const addBackdropImage = async (collectionId: string, dto: Partial<BackdropImageDto>) => {
    const token = localStorage.getItem('auth_token');
    const res = await apiClient.post<BackdropImageDto>(`/BackdropCollections/${collectionId}/images`, dto, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
};

export const deleteBackdropImage = async (collectionId: string, imageId: string) => {
    const token = localStorage.getItem('auth_token');
    await apiClient.delete(`/BackdropCollections/${collectionId}/images/${imageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};

export const addBookingFollowUp = async (bookingId: string, note: string) => {

    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/bookings/${bookingId}/followup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note })
    });
    if (!res.ok) throw new Error('Failed to add follow-up');
};
