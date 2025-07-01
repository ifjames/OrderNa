import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Login() {
  const [, navigate] = useLocation();
  const { user, loading, login, error } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-lg glass-morphism border-white/30 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-6 pt-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/95 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 floating-action">
              <Utensils className="w-10 h-10 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-poppins font-bold text-white mb-3 text-shadow-lg">
              Welcome to OrderNa
            </CardTitle>
            <p className="text-red-100 text-lg font-medium">
              Skip the Line, Not the Meal
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 px-8 pb-8">
          <div className="text-center">
            <p className="text-red-100 text-sm mb-8 leading-relaxed">
              Sign in with your Google account to start ordering from University of Batangas canteens
            </p>
            
            <Button 
              onClick={login}
              className="w-full bg-white/95 text-gray-900 hover:bg-white font-semibold py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20 group"
              disabled={loading}
            >
              <svg className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
            
            {error && (
              <div className="mt-6 p-4 glass-morphism-light border border-red-300/30 rounded-xl">
                <p className="text-red-200 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}
          </div>
          
          <div className="text-center border-t border-white/20 pt-6">
            <p className="text-red-200 text-xs leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
