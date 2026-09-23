export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'FRANCHISE_OWNER';

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mobile: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<User | null>;
}
