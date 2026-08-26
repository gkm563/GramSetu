import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { loginWithEmail, logoutUser, AuthorityUser } from '../services/authService';
import { getUserProfile } from '../services/usersService';
import { UserRole } from '../types/user';

interface AuthContextType {
  user: AuthorityUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRoleDemo?: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'gramsetu_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthorityUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          let role: UserRole = 'sachiv';
          if (fbUser.email?.toLowerCase().includes('admin') || fbUser.email?.toLowerCase().includes('bdo')) {
            role = 'admin';
          } else if (fbUser.email?.toLowerCase().includes('pradhan')) {
            role = 'pradhan';
          } else if (profile?.role) {
            role = profile.role as UserRole;
          }

          const currentAuthUser: AuthorityUser = {
            id: fbUser.uid,
            firebaseUid: fbUser.uid,
            email: fbUser.email || '',
            name: profile?.name || (role === 'pradhan' ? 'Gram Pradhan' : role === 'sachiv' ? 'Panchayat Sachiv' : 'Grievance Officer'),
            role: role,
            village: profile?.village || 'Rampur Gram Panchayat',
            ward: profile?.ward || 'All Wards',
            designation: role === 'pradhan' ? 'Elected Village Head' : role === 'sachiv' ? 'Panchayat Secretary' : 'Block Grievance Officer',
          };
          setUser(currentAuthUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentAuthUser));
        } catch (err) {
          console.warn('Error loading user profile on auth change:', err);
        }
      } else {
        // If not in Firebase Auth, check if we have a demo session
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const authUser = await loginWithEmail(email, pass);
      setUser(authUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  const switchRoleDemo = (role: UserRole) => {
    const isPradhan = role === 'pradhan';
    const isSachiv = role === 'sachiv';
    const demoUser: AuthorityUser = {
      id: `demo-${role}-uid`,
      firebaseUid: `demo-${role}-uid`,
      email: isPradhan ? 'pradhan@gramsetu.in' : isSachiv ? 'sachiv@gramsetu.in' : 'admin@gramsetu.in',
      name: isPradhan ? 'Shri Ramswaroop Yadav (Gram Pradhan)' : isSachiv ? 'Pankaj Sharma (Panchayat Sachiv)' : 'Anurag Verma (BDO / Admin)',
      role: role,
      village: 'Rampur Gram Panchayat',
      ward: 'All Wards',
      designation: isPradhan ? 'Elected Village Head' : isSachiv ? 'Panchayat Secretary' : 'Block Grievance Officer',
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        switchRoleDemo,
        isAuthenticated: Boolean(user),
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
