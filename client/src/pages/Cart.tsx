import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOrder } from '@/hooks/useOrders';
import { useNotifications } from '@/components/ui/notification';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Adobo Rice Bowl',
      price: 85,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    },
    {
      id: 2,
      name: 'Mango Shake',
      price: 55,
      quantity: 1,
    },
  ]);
  const [pickupTime, setPickupTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const { user } = useAuth();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { addNotification } = useNotifications();

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = () => {
    if (!user) return;

    const orderData = {
      userId: user.id,
      items: cart,
      total: getTotalPrice(),
      pickupTime: pickupTime || 'ASAP',
      specialInstructions,
      canteenId: 'main-canteen',
    };

    createOrder(
      { orderData, cartItems: cart },
      {
        onSuccess: (order) => {
          addNotification('Order placed successfully!', 'success');
          setCart([]);
          // Navigate to order tracking page
          window.location.href = `/orders/${order.id}`;
        },
        onError: (error) => {
          addNotification('Failed to place order. Please try again.', 'error');
          console.error('Order error:', error);
        },
      }
    );
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Start browsing our menu to add delicious items to your cart
          </p>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary-dark text-white"
            onClick={() => window.location.href = '/menu'}
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
            Your Order
          </h1>
          <p className="text-xl text-gray-600">Review your items and checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">₱{item.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 bg-primary hover:bg-primary-dark text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">₱{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism sticky top-24">
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time
                  </label>
                  <Select value={pickupTime} onValueChange={setPickupTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Now (5-10 mins)</SelectItem>
                      <SelectItem value="break">Next Break (30 mins)</SelectItem>
                      <SelectItem value="lunch">Lunch Time (2 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <Textarea
                    placeholder="Any special requests..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>Total:</span>
                    <span className="text-primary">₱{getTotalPrice()}</span>
                  </div>
                  
                  <Button 
                    className="w-full gradient-bg text-white hover:opacity-90 floating-action"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
