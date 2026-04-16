const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5148';

export interface AdvisorDto {
  id: string;
  name: string;
  specialization?: string;
}

export interface AssignedConsultation {
  id: string;
  email?: string;
  phone?: string;
  comments?: string;
  status: string;
  createdAt: string;
  assignedAdvisorName?: string;
}

export const getAllAdvisors = async (): Promise<AdvisorDto[]> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/advisors`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch advisors');
  return response.json();
};

export const assignAdvisor = async (consultationRequestId: string, advisorId: string): Promise<void> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/advisors/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ consultationRequestId, advisorId }),
  });
  if (!response.ok) throw new Error('Failed to assign advisor');
};

export const getMyAssignedConsultations = async (): Promise<AssignedConsultation[]> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/api/advisors/my-consultations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch assigned consultations');
  return response.json();
};
