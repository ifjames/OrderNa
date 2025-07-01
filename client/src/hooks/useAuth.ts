import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, logout } from '@/lib/firebase';

export interface AuthUser {
  id: number;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'student' | 'staff' | 'admin';
  studentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // Fetch user from our PostgreSQL backend
          const response = await fetch(`/api/user/${firebaseUser.uid}`);
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else if (response.status === 404) {
            // User doesn't exist in our database yet
            // This happens when they sign in with Google for the first time
            const newUserData = {
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              role: 'student' as const,
            };

            const createResponse = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newUserData),
            });

            if (createResponse.ok) {
              const createdUser = await createResponse.json();
              setUser(createdUser);
            } else {
              throw new Error('Failed to create user');
            }
          } else {
            throw new Error('Failed to fetch user data');
          }
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
    logout: handleLogout,
    isAuthenticated: !!user,
  };
};
