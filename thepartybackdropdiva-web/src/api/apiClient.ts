import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5148/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach the token if it exists
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401 errors (Optional: clear storage or redirect)
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error('Session expired or unauthorized. Clearing auth data.');
            // Optional: localStorage.removeItem('auth_token');
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

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
    isCustom?: boolean;
    userId?: string;
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
    const token = localStorage.getItem('auth_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await apiClient.get<CateringMenuDto[]>('/Catalog/menus', { headers });
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

export const updateCustomMenu = async (id: string, name: string, menuItemIds: string[]) => {
    const token = localStorage.getItem('auth_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await apiClient.put<CateringMenuDto>(`/Catalog/menus/custom/${id}`, { name, menuItemIds }, { headers });
    return res.data;
};

export const deleteCustomMenu = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    await apiClient.delete(`/Catalog/menus/custom/${id}`, { headers });
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
    const res = await apiClient.post<BackdropCollectionDto>('/BackdropCollections', dto);
    return res.data;
};

export const updateBackdropCollection = async (id: string, dto: Partial<BackdropCollectionDto>) => {
    await apiClient.put(`/BackdropCollections/${id}`, dto);
};

export const deleteBackdropCollection = async (id: string) => {
    await apiClient.delete(`/BackdropCollections/${id}`);
};

export const addBackdropImage = async (collectionId: string, dto: Partial<BackdropImageDto>) => {
    const res = await apiClient.post<BackdropImageDto>(`/BackdropCollections/${collectionId}/images`, dto);
    return res.data;
};

export const updateBackdropImage = async (collectionId: string, imageId: string, dto: Partial<BackdropImageDto>) => {
    await apiClient.put(`/BackdropCollections/${collectionId}/images/${imageId}`, dto);
};

export const deleteBackdropImage = async (collectionId: string, imageId: string) => {
    await apiClient.delete(`/BackdropCollections/${collectionId}/images/${imageId}`);
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

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ url: string }>('/Upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data.url;
};
