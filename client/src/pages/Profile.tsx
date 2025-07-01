import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/firebase';
import { useLocation } from 'wouter';
import { User, Mail, Phone, IdCard, Shield, LogOut, Edit3 } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'staff' ? 'secondary' : 'outline'} className="mt-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IdCard className="w-5 h-5 mr-2 text-red-600" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {user.studentId && (
                  <div className="flex items-center space-x-3">
                    <IdCard className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Student ID</p>
                      <p className="font-medium">{user.studentId}</p>
                    </div>
                  </div>
                )}
                
                {user.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button variant="outline" className="justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full md:w-auto justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">₱0</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-600">Favorite Items</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">5.0</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}