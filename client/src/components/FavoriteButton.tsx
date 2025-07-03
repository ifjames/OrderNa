import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';

interface FavoriteButtonProps {
  menuItemId: string;
  className?: string;
}

export const FavoriteButton = ({ menuItemId, className }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { isFavorite, getFavoriteId, addFavorite, removeFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setLoading(true);
    try {
      if (isFavorite(menuItemId)) {
        const favoriteId = getFavoriteId(menuItemId);
        if (favoriteId) {
          await removeFavorite(favoriteId);
        }
      } else {
        await addFavorite(menuItemId);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 hover:bg-red-50 dark:hover:bg-red-950/20 ${className}`}
    >
      <Heart 
        className={`w-4 h-4 transition-colors ${
          isFavorite(menuItemId) 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-400 hover:text-red-500'
        }`} 
      />
    </Button>
  );
};