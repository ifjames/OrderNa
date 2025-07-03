import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';
import { MenuItem, CartItem } from '@shared/schema';

interface MenuCardProps {
  item: any; // Flexible for Firestore data
  onAddToCart: (item: CartItem) => void;
}

export const MenuCard = ({ item, onAddToCart }: MenuCardProps) => {
  const handleAddToCart = () => {
    onAddToCart({
      id: typeof item.id === 'string' ? parseInt(item.id) || Date.now() : item.id,
      name: item.name,
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price?.toString() || '0'),
      quantity: 1,
      image: item.image || undefined,
    });
  };

  return (
    <Card className="overflow-hidden menu-card group">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={item.image || `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Badge className="bg-primary/90 text-white border-none text-xs font-medium">
            ₱{(typeof item.price === 'number' ? item.price : parseFloat(item.price?.toString() || '0')).toFixed(0)}
          </Badge>
        </div>
        
        {/* Stock Status Overlay */}
        {!item.available || item.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-semibold">No More Available</Badge>
          </div>
        )}
        
        {/* Low Stock Warning */}
        {item.available && item.stock > 0 && item.stock <= 5 && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-orange-500 text-white text-xs">
              Only {item.stock} left
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-poppins font-semibold text-gray-900 text-lg group-hover:text-primary transition-colors duration-300">
            {item.name}
          </h3>
          <span className="text-primary font-bold text-xl opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            ₱{(typeof item.price === 'number' ? item.price : parseFloat(item.price?.toString() || '0')).toFixed(0)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        
        {/* Availability Info */}
        {item.available && item.stock > 0 && (
          <div className="mb-3 text-xs text-green-600 font-medium">
            {item.stock} available tomorrow
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 text-xs text-gray-700 font-medium">
                {parseFloat(item.rating).toFixed(1)}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs capitalize font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              {item.category}
            </Badge>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="btn-modern text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            disabled={!item.available || item.stock === 0}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
