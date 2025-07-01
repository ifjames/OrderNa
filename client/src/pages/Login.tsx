import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase';
import { Chrome, Eye, EyeOff, ArrowLeft, ExternalLink, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoPath from "@assets/ChatGPT_Image_Jul_1__2025__10_17_44_PM-removebg_1751379765787.png";

export default function Login() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    studentId: '',
    phoneNumber: '',
    acceptTerms: false
  });

  if (user) {
    // Redirect based on role
    if (user.role === 'admin') {
      setLocation('/admin');
    } else if (user.role === 'staff') {
      setLocation('/staff');
    } else {
      setLocation('/home');
    }
    return <div>Loading...</div>;
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Signed in successfully!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Google"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match"
      });
      return;
    }

    if (!formData.email || !formData.password || !formData.name || !formData.studentId || !formData.phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please accept the Terms of Service to continue"
      });
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        studentId: formData.studentId,
        phoneNumber: formData.phoneNumber
      });
      toast({
        title: "Success",
        description: "Account created successfully!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email and password"
      });
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(formData.email, formData.password);
      toast({
        title: "Success",
        description: "Signed in successfully!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Left Side - Image/Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slide-in-left">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/30 rounded-full -translate-y-32 translate-x-32 animate-float animate-delay-200"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/20 rounded-full translate-y-48 -translate-x-48 animate-float animate-delay-400"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center mb-8 animate-slide-up animate-delay-300">
            <img src={logoPath} alt="OrderNa Logo" className="w-32 h-32 mx-auto mb-8 drop-shadow-lg animate-scale-in animate-delay-200" />
            <h1 className="text-4xl font-bold mb-4 animate-fade-in animate-delay-400">Welcome to OrderNa</h1>
            <p className="text-xl text-red-100 leading-relaxed max-w-md animate-fade-in animate-delay-500">
              University of Batangas Food Ordering System
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center max-w-sm hover-lift animate-scale-in animate-delay-500">
            <h3 className="text-lg font-semibold mb-2">Pre-order your meals</h3>
            <p className="text-red-100 text-sm">
              Skip the lines and enjoy fresh campus meals with our convenient ordering system
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
        <div className="w-full max-w-md animate-slide-up animate-delay-200">
          {/* Return to Landing Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6 text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-300 dark:hover:text-red-200 dark:hover:bg-red-900/20"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>

          <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 hover-lift animate-scale-in animate-delay-300">
            <CardHeader className="text-center space-y-4 pb-6">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center animate-scale-in animate-delay-100">
                <img src={logoPath} alt="OrderNa Logo" className="w-16 h-16" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-red-800 dark:text-red-200 animate-fade-in animate-delay-400">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400 animate-fade-in animate-delay-500">
                {isLogin 
                  ? 'To keep connected with us, please login using your email and password.' 
                  : 'Create your University of Batangas student account'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 animate-slide-up animate-delay-400">
              <form onSubmit={isLogin ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-red-800 dark:text-red-200 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 h-12"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-red-800 dark:text-red-200 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 h-12 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {isLogin && (
                    <div className="text-right">
                      <Button variant="link" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm p-0 h-auto">
                        Forgot Password?
                      </Button>
                    </div>
                  )}
                </div>

                {/* Registration Fields */}
                {!isLogin && (
                  <>
                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-red-800 dark:text-red-200 font-medium">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 h-12"
                        required
                      />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-red-800 dark:text-red-200 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 h-12"
                        required
                      />
                    </div>

                    {/* Student ID */}
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-red-800 dark:text-red-200 font-medium">Student ID</Label>
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="Enter your student ID"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 h-12"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-red-800 dark:text-red-200 font-medium">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:focus:border-red-400 h-12"
                        required
                      />
                    </div>

                    {/* Terms of Service */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                        className="border-red-200 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 dark:border-red-700 dark:data-[state=checked]:bg-red-500 dark:data-[state=checked]:border-red-500 mt-1"
                      />
                      <Label 
                        htmlFor="acceptTerms" 
                        className="text-sm leading-relaxed text-red-800 dark:text-red-200"
                      >
                        I accept the{' '}
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 underline text-sm"
                          onClick={() => setLocation('/terms')}
                        >
                          Terms of Service
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </Label>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl hover-lift hover-glow transition-all duration-300 animate-bounce-subtle"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="loading-pulse w-5 h-5 bg-white rounded-full mr-2"></div>
                      {isLogin ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                    </span>
                  ) : (isLogin ? 'LOGIN' : 'CREATE ACCOUNT')}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button 
                type="button"
                variant="outline" 
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 h-12 font-medium hover-lift transition-all duration-300"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-5 h-5 mr-3 animate-bounce-subtle" />
                Sign in with Google
              </Button>

              {/* Toggle Login/Register */}
              <div className="text-center animate-fade-in animate-delay-500">
                <span className="text-gray-600 dark:text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-0 h-auto font-semibold hover-scale transition-all duration-200"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}