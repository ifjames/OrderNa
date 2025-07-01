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
import { Utensils, Menu, LogOut, User, ShoppingCart, History, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logout as firebaseLogout } from '@/lib/firebase';

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
    { href: '/orders', label: 'History', icon: History },
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-maroon-dark rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-poppins font-bold text-white text-shadow group-hover:text-red-100 transition-colors duration-300">OrderNa</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
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
