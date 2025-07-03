import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Gift } from 'lucide-react';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';

export const LoyaltyPointsDisplay = () => {
  const { points, loading } = useLoyaltyPoints();

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-yellow-200 rounded w-24 mb-2"></div>
            <div className="h-6 bg-yellow-200 rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <div>
              <p className="text-sm text-gray-600">Loyalty Points</p>
              <p className="text-xl font-bold text-yellow-600">{points.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Gift className="w-3 h-3 mr-1" />
              Rewards
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};