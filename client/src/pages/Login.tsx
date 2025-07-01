import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase';
import { Chrome, Eye, EyeOff } from 'lucide-react';
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
    role: 'student' as 'student' | 'staff' | 'admin'
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
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isLogin) {
        await signInWithEmailAndPassword(formData.email, formData.password);
        toast({
          title: "Success",
          description: "Signed in successfully!"
        });
      } else {
        await createUserWithEmailAndPassword({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          studentId: formData.studentId || undefined
        });
        toast({
          title: "Success",
          description: "Account created successfully!"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-200 dark:from-orange-950 dark:via-gray-900 dark:to-orange-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations inspired by the reference image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-400/30 to-yellow-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center p-8">
          <div className="mb-8">
            <img src={logoPath} alt="OrderNa Logo" className="h-32 w-32 mx-auto mb-6 animate-pulse" />
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              OrderNa
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-md">
              Welcome Back! To keep connected with us, please login using your email and password.
            </p>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            University of Batangas Food Ordering System
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-orange-200 dark:border-orange-800 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="lg:hidden mb-4">
                <img src={logoPath} alt="OrderNa Logo" className="h-16 w-16 mx-auto mb-3" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                {isLogin ? 'Welcome Back!' : 'Join OrderNa'}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {isLogin 
                  ? 'To keep connected with us, please login using your email and password.' 
                  : 'Create your account to get started with OrderNa'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="border-gray-300 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role" className="text-gray-700 dark:text-gray-200 font-medium">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}>
                        <SelectTrigger className="border-gray-300 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-800">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="staff">Staff (Canteen)</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.role === 'student' && (
                      <div>
                        <Label htmlFor="studentId" className="text-gray-700 dark:text-gray-200 font-medium">Student ID (Optional)</Label>
                        <Input
                          id="studentId"
                          type="text"
                          value={formData.studentId}
                          onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                          className="border-gray-300 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter your student ID"
                        />
                      </div>
                    )}
                  </>
                )}
                
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-gray-300 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white pr-10"
                      placeholder="Enter your password"
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
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="border-gray-300 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <Button variant="link" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 p-0 h-auto font-normal text-sm">
                      Forgot Password?
                    </Button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  {loading ? 'Please wait...' : (isLogin ? 'LOGIN' : 'CREATE ACCOUNT')}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>

              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                {" "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 p-0 h-auto font-semibold text-sm"
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