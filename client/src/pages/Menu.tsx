import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart } from 'lucide-react';
import { MenuCard } from '@/components/MenuCard';
import { useMenuItems } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CartItem } from '@shared/schema';
import { useNotifications } from '@/components/ui/notification';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCanteen, setSelectedCanteen] = useState(''); // Empty = no stall selected
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { addNotification } = useNotifications();
  const { data: menuItems, isLoading, error } = useMenuItems();

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'main', label: 'Main Course' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'drinks', label: 'Drinks' },
  ];

  const canteens = [
    { 
      id: 'main-canteen', 
      label: 'Main Canteen', 
      description: 'Traditional Filipino dishes & local favorites',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      brands: ['Local Kitchen'] 
    },
    { 
      id: 'chowking', 
      label: 'Chowking', 
      description: 'Chinese-Filipino fast food chain',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      brands: ['Chowking'] 
    },
    { 
      id: 'kfc', 
      label: 'KFC', 
      description: 'Finger lickin\' good fried chicken',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      brands: ['KFC'] 
    },
    { 
      id: 'jollibee', 
      label: 'Jollibee', 
      description: 'The home of the langhap-sarap Yumburger',
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      brands: ['Jollibee'] 
    }
  ];

  // Menu data comes from Firestore via useMenuItems hook

  const itemsToDisplay = menuItems && menuItems.length > 0 ? menuItems : [];
  
  // Only show items if a canteen is selected
  const filteredItems = selectedCanteen && itemsToDisplay ? itemsToDisplay.filter((item: any) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCanteen = item.canteenId === selectedCanteen;
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCanteen && matchesSearch;
  }) : [];

  const addToCart = (menuItem: any) => {
    const cartItem: CartItem = {
      id: typeof menuItem.id === 'string' ? parseInt(menuItem.id) || Date.now() : menuItem.id,
      name: menuItem.name,
      price: typeof menuItem.price === 'number' ? menuItem.price : parseFloat(menuItem.price?.toString().replace('₱', '')) || 0,
      quantity: 1,
      image: menuItem.image,
      customizations: {}
    };
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === cartItem.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, cartItem];
      }
    });
    // addNotification(`${menuItem.name} added to cart!`, 'success'); // Temporarily disabled
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load menu items</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show stall selection if no stall is selected
  if (!selectedCanteen) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-red-50 via-white to-red-50 animate-fade-in">
        {/* Header */}
        <section className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Stall
            </h1>
            <p className="text-xl text-red-100">
              Select a canteen to view their menu
            </p>
          </div>
        </section>

        {/* Stall Selection Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canteens.map((canteen) => (
              <div
                key={canteen.id}
                onClick={() => setSelectedCanteen(canteen.id)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 relative">
                  <img 
                    src={canteen.image} 
                    alt={canteen.label}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{canteen.label}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{canteen.description}</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    View Menu
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-red-50 via-white to-red-50 animate-fade-in">
      {/* Header with Back Button */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCanteen('')}
            className="text-white hover:bg-white/10 mb-4"
          >
            ← Back to Stalls
          </Button>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {canteens.find(c => c.id === selectedCanteen)?.label} Menu
            </h1>
            <p className="text-xl text-red-100">
              Fresh meals available now
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 animate-slide-up animate-delay-300">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 animate-slide-in-left animate-delay-400">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 dark:text-red-300 w-5 h-5 animate-bounce-subtle" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover-lift transition-all duration-300"
              />
            </div>
          </div>

          {/* Smart Filters - Categories, Canteens & Brands in One Line */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 items-center animate-slide-in-right animate-delay-500">
              {/* Categories Section */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Categories:</span>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    className={`
                      hover-scale transition-all duration-300
                      ${selectedCategory === category.id
                        ? 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 hover-glow'
                        : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Menu Items - Scrollable Grid with 4 items per view */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-red-700 dark:text-red-300 text-lg">No items found</p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Mobile: Single column, scrollable with 4 items visible */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-4 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-red-100 dark:scrollbar-thumb-red-600 dark:scrollbar-track-red-900">
                {filteredItems.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
            
            {/* Tablet: 2 columns, scrollable */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-red-100 dark:scrollbar-thumb-red-600 dark:scrollbar-track-red-900">
                {filteredItems.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
            
            {/* Desktop: Grid layout */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-red-100 dark:scrollbar-thumb-red-600 dark:scrollbar-track-red-900">
                {filteredItems.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-30">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 text-white shadow-2xl rounded-full w-16 h-16 transition-all duration-300 hover:scale-110"
            onClick={() => {/* Navigate to cart */}}
          >
            <ShoppingCart className="w-6 h-6" />
            <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white">
              {getTotalItems()}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  );
}
