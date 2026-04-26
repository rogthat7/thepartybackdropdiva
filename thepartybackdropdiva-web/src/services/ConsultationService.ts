const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5148';

export interface AdminConsultationRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  comments?: string;
  status: string;
  createdAt: string;
  eventType?: string;
  eventDate?: string;
  guestCount?: string;
  venueLocation?: string;
  servicesInterested?: string;
}

export const getAllConsultations = async (): Promise<AdminConsultationRequest[]> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/admin/consultations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch consultations');
  }
  return response.json();
};

export const updateConsultationStatus = async (id: string, status: string): Promise<void> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/admin/consultations/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update status');
  }
};

export const deleteConsultationRequest = async (id: string): Promise<void> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/admin/consultations/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete consultation request');
  }
};

export const getAllBookings = async (): Promise<any[]> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};
