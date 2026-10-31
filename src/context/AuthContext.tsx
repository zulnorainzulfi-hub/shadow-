import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USER } from '../data/initialData';

export const getPlanDailyQuota = (planId?: string): number => {
  switch (planId) {
    case 'plan-pro':
      return 100;
    case 'plan-premium':
      return 500;
    case 'plan-ultimate':
      return 999999; // Unlimited
    case 'plan-free':
    default:
      return 25;
  }
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (customProfile?: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  toggleAdminRole: () => void;
  incrementAiUsage: () => boolean;
  deleteAccount: () => void;
  linkGoogleAccount: (googleProfile: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }) => void;
  unlinkGoogleAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'shadowhost_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.aiDailyQuota === undefined) {
          parsed.aiDailyQuota = getPlanDailyQuota(parsed.planId);
        }
        if (parsed.aiUsageToday === undefined) {
          parsed.aiUsageToday = 3;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load user session', e);
    }
    return DEMO_USER;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (email: string): Promise<boolean> => {
    const quota = getPlanDailyQuota('plan-free');
    const user: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || 'User',
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString().split('T')[0],
      planId: 'plan-free',
      authProvider: 'email',
      aiUsageToday: 0,
      aiDailyQuota: quota,
    };
    setCurrentUser(user);
    return true;
  };

  const loginWithGoogle = async (customProfile?: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }): Promise<boolean> => {
    const email = customProfile?.email || 'zulnorainzulfi@gmail.com';
    const name = customProfile?.name || 'Zulnorain Zulfi';
    const avatar = customProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80';
    const googleId = customProfile?.googleId || `g-oauth-${Date.now()}`;

    const quota = getPlanDailyQuota('plan-free');
    const user: User = {
      id: `usr-g-${Date.now()}`,
      name: name,
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      avatarUrl: avatar,
      authProvider: 'google',
      googleId: googleId,
      createdAt: new Date().toISOString().split('T')[0],
      planId: 'plan-free',
      aiUsageToday: 1,
      aiDailyQuota: quota,
    };
    setCurrentUser(user);
    return true;
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    const quota = getPlanDailyQuota('plan-free');
    const user: User = {
      id: `usr-${Date.now()}`,
      name: name,
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString().split('T')[0],
      planId: 'plan-free',
      authProvider: 'email',
      aiUsageToday: 0,
      aiDailyQuota: quota,
    };
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const deleteAccount = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    console.log(`Password reset link dispatched to ${email}`);
    return true;
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...updates });
  };

  const linkGoogleAccount = (googleProfile: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      googleId: googleProfile.googleId || `g-oauth-${Date.now()}`,
      avatarUrl: googleProfile.avatarUrl || currentUser.avatarUrl,
      authProvider: 'google',
    });
  };

  const unlinkGoogleAccount = () => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      googleId: undefined,
      authProvider: 'email',
    });
  };

  const incrementAiUsage = (): boolean => {
    if (!currentUser) return false;
    const quota = currentUser.aiDailyQuota ?? getPlanDailyQuota(currentUser.planId);
    const used = currentUser.aiUsageToday ?? 0;
    if (used >= quota && quota < 999999) {
      return false; // Quota exhausted
    }
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            aiUsageToday: (prev.aiUsageToday ?? 0) + 1,
            aiDailyQuota: quota,
          }
        : null
    );
    return true;
  };

  const toggleAdminRole = () => {
    if (!currentUser) return;
    const nextRole: UserRole = currentUser.role === 'admin' ? 'user' : 'admin';
    setCurrentUser({ ...currentUser, role: nextRole });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
        updateProfile,
        toggleAdminRole,
        incrementAiUsage,
        deleteAccount,
        linkGoogleAccount,
        unlinkGoogleAccount,
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
