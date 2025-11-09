import api, { setAuthToken } from '@/app/api';
import type { LoginFormData, RegisterFormData } from '../schema';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export const authApi = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    } satisfies LoginRequest);

    setAuthToken(response.data.token);

    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', {
      email: data.email,
      password: data.password,
      displayName: data.displayName,
    } satisfies RegisterRequest);

    setAuthToken(response.data.token);

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAuthToken(null);
    }
  },

  getCurrentUser: async () => {
    const response = await api.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },
};
