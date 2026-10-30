import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'PROFESSIONAL' | 'ORGANIZATION_ADMIN' | 'RECRUITER' | 'SUPER_ADMIN';

export interface AuthUser {
  id?: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  headline?: string;
  profession?: string;
  organizationName?: string;
  specialization?: string;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  profile?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<AuthUser>;
  register: (data: any) => Promise<AuthUser>;
  logout: () => void;
  getDashboardPath: (role?: UserRole) => string;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
  // Backward compatibility alias for legacy components
  switchRolePersona?: (roleKey: string) => void;
  switchRole?: (role: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getRoleDashboardPath = (role?: UserRole): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/superadmin/dashboard';
    case 'ORGANIZATION_ADMIN':
      return '/organization/dashboard';
    case 'RECRUITER':
      return '/recruiter/dashboard';
    case 'PROFESSIONAL':
    default:
      return '/professional/dashboard';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('meddhatri_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('meddhatri_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('meddhatri_current_user');
    }
  }, [user]);

  // Synchronize token to localStorage
  const saveTokens = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('meddhatri_token', accessToken);
    localStorage.setItem('meddhatri_jwt_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('meddhatri_refresh_token', refreshToken);
    }
    setToken(accessToken);
  };

  const clearTokens = () => {
    localStorage.removeItem('meddhatri_token');
    localStorage.removeItem('meddhatri_jwt_token');
    localStorage.removeItem('meddhatri_refresh_token');
    localStorage.removeItem('meddhatri_current_user');
    setToken(null);
    setUser(null);
  };

  // Initial authentication verification on app mount
  useEffect(() => {
    const verifySession = async () => {
      const activeToken = localStorage.getItem('meddhatri_token') || localStorage.getItem('meddhatri_jwt_token');
      if (!activeToken) {
        localStorage.removeItem('meddhatri_current_user');
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.user) {
            setUser(result.data.user);
            setToken(activeToken);
            setIsLoading(false);
            return;
          }
        }

        // If access token is expired, attempt refresh
        const refreshToken = localStorage.getItem('meddhatri_refresh_token');
        if (refreshToken) {
          const refreshRes = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.success && refreshData.data?.accessToken) {
              saveTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
              // Retry /auth/me with new token
              const retryRes = await fetch('/api/v1/auth/me', {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${refreshData.data.accessToken}`
                }
              });
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                if (retryData.success && retryData.data?.user) {
                  setUser(retryData.data.user);
                  setIsLoading(false);
                  return;
                }
              }
            }
          }
        }

        // Token invalid and cannot refresh
        clearTokens();
      } catch (err) {
        console.warn('[AuthContext] Session verification failed:', err);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password?: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password || 'Doctor@MedDhatri2026'
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid email or password. Please verify your credentials.');
      }

      const userData: AuthUser = result.data.user;
      const accessToken: string = result.data.accessToken;
      const refreshToken: string = result.data.refreshToken;

      if (accessToken) {
        saveTokens(accessToken, refreshToken);
      }

      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed. Please check the details entered.');
      }

      const userData: AuthUser = result.data.user;
      const accessToken: string = result.data.accessToken;
      const refreshToken: string = result.data.refreshToken;

      if (accessToken) {
        saveTokens(accessToken, refreshToken);
      }

      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    const activeToken = token || localStorage.getItem('meddhatri_token');
    if (!activeToken) return;

    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.user) {
          setUser(result.data.user);
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Failed to refresh user profile:', e);
    }
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        getDashboardPath: (role?: UserRole) => getRoleDashboardPath(role || user?.role),
        hasRole,
        refreshUser,
        switchRolePersona: () => {},
        switchRole: () => {} // No-op placeholder to prevent legacy breaks
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
