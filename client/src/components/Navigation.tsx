import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Utensils, Menu, LogOut, User, ShoppingCart, History, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout as firebaseLogout } from '@/lib/firebase';
import logoPath from "@assets/ChatGPT_Image_Jul_1__2025__10_17_44_PM-removebg_1751379765787.png";

export const Navigation = () => {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setLocation('/'); // Redirect to landing page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigationItems = [
    { href: '/', label: 'Home', icon: Utensils },
    { href: '/menu', label: 'Menu', icon: Menu },
    { href: '/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
  ];

  const staffNavigationItems = [
    { href: '/staff', label: 'Dashboard', icon: Settings },
    ...navigationItems,
  ];

  const adminNavigationItems = [
    { href: '/admin', label: 'Admin', icon: Settings },
    ...staffNavigationItems,
  ];

  const getNavigationItems = () => {
    if (user?.role === 'admin') return adminNavigationItems;
    if (user?.role === 'staff') return staffNavigationItems;
    return navigationItems;
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {getNavigationItems().map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`
            ${mobile ? 'block px-4 py-2 text-white hover:bg-white/10 rounded-lg' : 'text-white/80 hover:text-white'}
            transition-colors
            ${location === href ? 'text-white font-semibold' : ''}
          `}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </div>
        </Link>
      ))}
    </>
  );

  if (!user) return null;

  return (
    <nav className="glass-morphism-dark fixed top-0 left-0 right-0 z-50 border-b border-white/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-maroon-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
              <img src={logoPath} alt="OrderNa Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-xl font-poppins font-bold text-white text-shadow group-hover:text-red-100 transition-colors duration-300">OrderNa</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="flex items-center w-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="font-medium">Order #1234 Ready</span>
                    <span className="text-xs text-gray-500 ml-auto">2m ago</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">Your Chicken Adobo order is ready for pickup</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="flex items-center w-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="font-medium">New Menu Items</span>
                    <span className="text-xs text-gray-500 ml-auto">1h ago</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">Check out our new pasta dishes now available</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="flex items-center w-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium">Payment Confirmed</span>
                    <span className="text-xs text-gray-500 ml-auto">3h ago</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">Payment for order #1233 has been processed</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Cart Icon */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-morphism-dark border-white/10">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
