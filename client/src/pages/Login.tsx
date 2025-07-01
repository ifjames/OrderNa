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
import { Chrome, Eye, EyeOff, ArrowLeft, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950 dark:via-gray-900 dark:to-red-950">
      <div className="container mx-auto px-4 py-8">
        {/* Logo Return Button */}
        {!isLogin && (
          <Button
            variant="ghost"
            onClick={() => setIsLogin(true)}
            className="mb-6 text-red-700 hover:text-red-800 hover:bg-red-50 dark:text-red-300 dark:hover:text-red-200 dark:hover:bg-red-900/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <img src={logoPath} alt="OrderNa" className="w-6 h-6 mr-2" />
            Back to Login
          </Button>
        )}

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <img src={logoPath} alt="OrderNa Logo" className="w-20 h-20" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-800 dark:text-red-200">
                {isLogin ? 'Welcome Back' : 'Join OrderNa'}
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                {isLogin 
                  ? 'Sign in to your University of Batangas student account' 
                  : 'Create your University of Batangas student account'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={isLogin ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-red-800 dark:text-red-200">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-red-800 dark:text-red-200">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400 pr-10"
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
                        <EyeOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Registration Fields */}
                {!isLogin && (
                  <>
                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-red-800 dark:text-red-200">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400"
                        required
                      />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-red-800 dark:text-red-200">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400"
                        required
                      />
                    </div>

                    {/* Student ID - Required */}
                    <div className="space-y-2">
                      <Label htmlFor="studentId" className="text-red-800 dark:text-red-200">Student ID *</Label>
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="Enter your student ID"
                        value={formData.studentId}
                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400"
                        required
                      />
                    </div>

                    {/* Phone Number - Required */}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-red-800 dark:text-red-200">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:border-red-400"
                        required
                      />
                    </div>

                    {/* Terms of Service Checkbox */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                        className="border-red-200 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 dark:border-red-700 dark:data-[state=checked]:bg-red-500 dark:data-[state=checked]:border-red-500"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor="acceptTerms" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-red-800 dark:text-red-200"
                        >
                          I accept the{' '}
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto p-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 underline"
                            onClick={() => setLocation('/terms')}
                          >
                            Terms of Service
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </Label>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-red-200 dark:bg-red-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-red-600 dark:text-red-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button 
                type="button"
                variant="outline" 
                className="w-full border-red-200 text-red-800 hover:bg-red-50 hover:text-red-900 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-100"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}