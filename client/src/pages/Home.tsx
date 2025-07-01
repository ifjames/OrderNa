import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ShoppingCart, QrCode, Utensils, Clock, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: ShoppingCart,
      title: 'Browse & Order',
      description: 'Browse the digital menu during class or before break time. Place your order with just a few taps.',
    },
    {
      icon: QrCode,
      title: 'Get QR Code',
      description: 'Receive a unique QR code instantly after placing your order. Save it to your phone or take a screenshot.',
    },
    {
      icon: Utensils,
      title: 'Quick Pickup',
      description: 'Show your QR code at the canteen counter. Your food will be ready for immediate pickup!',
    },
  ];

  const quickStats = [
    { label: 'Active Canteens', value: '3' },
    { label: 'Menu Items', value: '50+' },
    { label: 'Happy Students', value: '1000+' },
    { label: 'Average Wait Time', value: '2 min' },
  ];

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 dark:from-red-900 dark:via-red-800 dark:to-red-900 text-white py-20 px-4 animate-slide-down">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
            Skip the Line,<br />
            <span className="text-red-200">Not the Meal</span>
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
            Order your favorite canteen meals in advance and pick them up with just a QR code. 
            Perfect for busy university life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="glass-morphism hover:bg-white/20 text-white border-white/30 floating-action">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Ordering
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Utensils className="w-5 h-5 mr-2" />
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="text-center glass-morphism">
                <CardContent className="pt-6">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
              How OrderNa Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your canteen experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-morphism hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-maroon rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
                Popular Today
              </h2>
              <p className="text-xl text-gray-600">Most ordered items from UB canteens</p>
            </div>
            <Link href="/menu">
              <Button variant="outline" className="hidden md:flex items-center">
                View All Menu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Adobo Rice Bowl',
                price: 85,
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
                category: 'Main Course'
              },
              {
                name: 'Pancit Canton',
                price: 65,
                rating: 4.6,
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
                category: 'Main Course'
              },
              {
                name: 'Fresh Lumpia',
                price: 45,
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1563379091339-03246963d22a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
                category: 'Snacks'
              },
              {
                name: 'Mango Shake',
                price: 55,
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
                category: 'Drinks'
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden menu-card hover:shadow-lg transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-poppins font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-primary font-bold text-lg">
                      ₱{item.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {item.rating}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary-dark text-white">
                View All Menu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 gradient-bg text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
            Ready to Skip the Line?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of UB students who are already enjoying faster, smarter canteen ordering
          </p>
          <Link href="/menu">
            <Button size="lg" className="glass-morphism hover:bg-white/20 text-white border-white/30 floating-action">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
