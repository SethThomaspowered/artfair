export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUri?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}