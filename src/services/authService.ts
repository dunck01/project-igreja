import { httpClient } from './httpClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user: AuthUser;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async validateToken(): Promise<ValidateTokenResponse> {
    try {
      const response = await httpClient.get<ValidateTokenResponse>('/auth/validate');
      
      // Update stored user data
      if (response.valid && response.user) {
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      // If token validation fails, clear stored data
      this.logout();
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }
}

export const authService = new AuthService();
