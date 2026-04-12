const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5148';

export interface LoginRequest {
  email: string;
}

export const loginUser = async (email: string, password: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  return response.json();
};

export const registerUser = async (data: any): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData) || 'Registration failed');
  }

  return response.json();
};
