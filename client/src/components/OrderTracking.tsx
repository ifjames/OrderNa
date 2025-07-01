import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Utensils } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface OrderTrackingProps {
  order: any;
  loading?: boolean;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500' },
  preparing: { icon: LoadingSpinner, color: 'text-blue-500', bg: 'bg-blue-500' },
  ready: { icon: Utensils, color: 'text-green-500', bg: 'bg-green-500' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-600' },
};

export const OrderTracking = ({ order, loading }: OrderTrackingProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  const currentStatus = order.status || 'pending';
  const statusSteps = ['pending', 'preparing', 'ready', 'completed'];
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <Card className="glass-morphism-dark text-white">
      <CardHeader>
        <CardTitle className="text-xl font-poppins">Order Tracking</CardTitle>
        <div className="flex items-center justify-between">
          <span>Order #{order.orderNumber}</span>
          <Badge variant="secondary">
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          {statusSteps.map((status, index) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            const Icon = config.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${isActive ? config.bg : 'bg-gray-600'}
                  ${isCurrent ? 'ring-2 ring-white' : ''}
                `}>
                  {isCurrent && status === 'preparing' ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                </div>
                <span className="text-sm capitalize">{status}</span>
                {index < statusSteps.length - 1 && (
                  <div className={`
                    absolute top-5 left-1/2 transform -translate-y-1/2 w-full h-1
                    ${isActive ? 'bg-green-500' : 'bg-gray-600'}
                  `} style={{ zIndex: -1 }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Total:</span>
            <span className="font-semibold text-primary">₱{parseFloat(order.total).toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pickup Time:</span>
            <span className="font-semibold">{order.pickupTime || 'ASAP'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Ordered:</span>
            <span className="font-semibold">
              {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString() : 'Just now'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
