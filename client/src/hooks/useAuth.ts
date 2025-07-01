import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInWithGoogle, logout, createUser, getUser } from '@/lib/firebase';

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin';
  studentId?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          let userData = await getUser(firebaseUser.uid);
          
          if (!userData) {
            // Create new user in Firestore
            userData = await createUser({
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              role: 'student',
            });
          }
          
          setUser(userData as AuthUser);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user data');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
};
