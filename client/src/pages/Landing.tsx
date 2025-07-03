import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, QrCode, Shield, Star, Users, Truck, Heart, MapPin } from "lucide-react";
import logoPath from "@assets/ChatGPT_Image_Jul_1__2025__10_17_44_PM-removebg_1751379765787.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Clock,
      title: "Quick Orders",
      description: "Skip the line with advance ordering and pickup scheduling"
    },
    {
      icon: QrCode,
      title: "QR Pickup",
      description: "Scan QR codes for instant order verification and pickup"
    },
    {
      icon: Truck,
      title: "Campus Delivery",
      description: "Get your food delivered directly to your location on campus"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple options"
    },
    {
      icon: Star,
      title: "Quality Food",
      description: "Fresh, delicious meals from trusted university canteens"
    },
    {
      icon: Heart,
      title: "Favorites & Reviews",
      description: "Save your favorite dishes and share reviews with fellow students"
    }
  ];

  const stats = [
    { number: "1000+", label: "Happy Students" },
    { number: "50+", label: "Menu Items" },
    { number: "5", label: "Canteen Partners" },
    { number: "99%", label: "Order Accuracy" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-maroon-50 dark:from-red-950 dark:via-gray-900 dark:to-maroon-950">
      {/* Header */}
      <header className="border-b border-red-100 dark:border-red-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoPath} alt="UB FoodHub Logo" className="h-12 w-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-maroon-600 bg-clip-text text-transparent">
              UB FoodHub
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/login")}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setLocation("/login")}
              className="bg-gradient-to-r from-red-600 to-maroon-600 hover:from-red-700 hover:to-maroon-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <img src={logoPath} alt="UB FoodHub Logo" className="h-24 w-24 mx-auto mb-8 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-maroon-600 to-red-800 bg-clip-text text-transparent">
              UB FoodHub
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Skip the line, order ahead, and enjoy your favorite meals with QR codes at University of Batangas canteens. Now with campus delivery!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => setLocation("/login")}
                className="bg-gradient-to-r from-red-600 to-maroon-600 hover:from-red-700 hover:to-maroon-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group"
              >
                Start Ordering Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 px-8 py-4 text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Join as Staff
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose UB FoodHub?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of campus dining with our innovative ordering and delivery system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center border-red-100 dark:border-red-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transform hover:scale-105 transition-all duration-200 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-600 to-maroon-600 text-white rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Features Highlight */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-maroon-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Truck className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Campus Delivery</h3>
              <p className="opacity-90">Get your food delivered to your dorm, library, or anywhere on campus</p>
            </div>
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Loyalty Rewards</h3>
              <p className="opacity-90">Earn points with every order and unlock exclusive discounts</p>
            </div>
            <div>
              <Star className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Reviews & Ratings</h3>
              <p className="opacity-90">Share your experience and discover the best dishes on campus</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-maroon-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Campus Dining?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students already using UB FoodHub for faster, smarter food ordering and delivery
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/login")}
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={logoPath} alt="UB FoodHub Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">UB FoodHub</span>
            </div>
            <div className="text-gray-400">
              © 2025 UB FoodHub. All rights reserved. University of Batangas
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}