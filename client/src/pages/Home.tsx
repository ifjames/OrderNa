import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ShoppingCart, Clock, Star, ArrowRight, MapPin, Utensils, Receipt, Search, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserOrders } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';

export default function Home() {
  const { user } = useAuth();
  const { data: recentOrders, isLoading: ordersLoading } = useUserOrders(user?.firebaseUid || '');

  // Popular food items to display
  const popularItems = [
    {
      id: 1,
      name: 'Adobo Rice Bowl',
      price: 85,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      category: 'Main Course',
      prepTime: '15-20 min'
    },
    {
      id: 2,
      name: 'Pancit Canton',
      price: 75,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      category: 'Main Course',
      prepTime: '10-15 min'
    },
    {
      id: 3,
      name: 'Fresh Lumpia',
      price: 45,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      category: 'Snacks',
      prepTime: '5-10 min'
    },
    {
      id: 4,
      name: 'Mango Shake',
      price: 55,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      category: 'Drinks',
      prepTime: '3-5 min'
    }
  ];

  const quickActions = [
    { icon: Utensils, label: 'Browse Menu', href: '/menu', color: 'bg-red-500' },
    { icon: Receipt, label: 'My Orders', href: '/orders', color: 'bg-blue-500' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', color: 'bg-green-500' },
    { icon: User, label: 'Profile', href: '/profile', color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white pt-20 pb-6 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-red-100">What would you like to eat today?</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search for food, drinks, snacks..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="text-center p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium">{action.label}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        {recentOrders && recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Orders</span>
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="text-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">₱{order.total}</p>
                        </div>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Popular Today</span>
              <Link href="/menu">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularItems.map((item, index) => {
                const stock = [25, 18, 0, 12][index]; // Stock for tomorrow
                const isAvailable = stock > 0;
                
                return (
                  <Card 
                    key={item.id} 
                    className="group overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-500 cursor-pointer hover:border-red-300 dark:hover:border-red-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                    onClick={() => window.location.href = '/menu'}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm font-semibold">No More Available</Badge>
                        </div>
                      )}
                      
                      {isAvailable && stock <= 5 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-orange-500 text-white text-xs">
                            Only {stock} left
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4 group-hover:bg-red-50/50 dark:group-hover:bg-red-950/20 transition-colors duration-300">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-600 dark:text-red-400 font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          ₱{item.price}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{item.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <Badge variant="secondary" className="text-xs group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors duration-300">
                          {item.category}
                        </Badge>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.prepTime}
                        </div>
                      </div>
                      
                      {isAvailable && (
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                          {stock} available tomorrow
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Canteen Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              UB Canteens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Main Canteen', status: 'Open', waitTime: '5-10 min', distance: '0.2 km' },
                { name: 'Engineering Canteen', status: 'Open', waitTime: '3-8 min', distance: '0.5 km' },
                { name: 'Medical Canteen', status: 'Busy', waitTime: '10-15 min', distance: '0.8 km' }
              ].map((canteen, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{canteen.name}</h4>
                    <Badge variant={canteen.status === 'Open' ? 'default' : 'secondary'}>
                      {canteen.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Wait: {canteen.waitTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {canteen.distance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
