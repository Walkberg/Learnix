// Auth types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'FREE' | 'PREMIUM';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}
