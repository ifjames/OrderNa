import { useState, useEffect } from 'react';
import { addToFavorites, removeFromFavorites, getUserFavorites } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/components/ui/notification';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userFavorites = await getUserFavorites(user.firebaseUid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      addNotification({ message: 'Failed to load favorites', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (menuItemId: string) => {
    if (!user) return;

    try {
      const favoriteId = await addToFavorites(user.firebaseUid, menuItemId);
      setFavorites(prev => [...prev, { id: favoriteId, userId: user.firebaseUid, menuItemId }]);
      addNotification({ message: 'Added to favorites!', type: 'success' });
    } catch (error) {
      console.error('Error adding favorite:', error);
      addNotification({ message: 'Failed to add to favorites', type: 'error' });
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      await removeFromFavorites(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      addNotification({ message: 'Removed from favorites', type: 'success' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      addNotification({ message: 'Failed to remove from favorites', type: 'error' });
    }
  };

  const isFavorite = (menuItemId: string) => {
    return favorites.some(fav => fav.menuItemId === menuItemId);
  };

  const getFavoriteId = (menuItemId: string) => {
    const favorite = favorites.find(fav => fav.menuItemId === menuItemId);
    return favorite?.id;
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteId,
    refetch: loadFavorites,
  };
};