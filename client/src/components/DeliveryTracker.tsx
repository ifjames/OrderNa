import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Clock, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DeliveryTrackerProps {
  deliveryOrderId: string;
}

const deliveryStatusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Order Received' },
  assigned: { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500', label: 'Driver Assigned' },
  picked_up: { icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-500', label: 'Order Picked Up' },
  delivered: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500', label: 'Delivered' },
};

export const DeliveryTracker = ({ deliveryOrderId }: DeliveryTrackerProps) => {
  const [deliveryOrder, setDeliveryOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock delivery tracking data
    const mockDeliveryOrder = {
      id: deliveryOrderId,
      deliveryStatus: 'picked_up',
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
      deliveryAddress: 'Engineering Building, Room 301',
      driverName: 'Juan Dela Cruz',
      driverPhone: '+63 912 345 6789',
    };

    setTimeout(() => {
      setDeliveryOrder(mockDeliveryOrder);
      setLoading(false);
    }, 1000);
  }, [deliveryOrderId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading delivery details...</p>
        </CardContent>
      </Card>
    );
  }

  if (!deliveryOrder) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Delivery information not found</p>
        </CardContent>
      </Card>
    );
  }

  const currentStatus = deliveryOrder.deliveryStatus;
  const statusSteps = ['pending', 'assigned', 'picked_up', 'delivered'];
  const currentIndex = statusSteps.indexOf(currentStatus);

  return (
    <Card className="glass-morphism-dark text-white">
      <CardHeader>
        <CardTitle className="text-xl font-poppins flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Delivery Tracking
        </CardTitle>
        <div className="flex items-center justify-between">
          <span>Delivery to: {deliveryOrder.deliveryAddress}</span>
          <Badge variant="secondary">
            {deliveryStatusConfig[currentStatus as keyof typeof deliveryStatusConfig]?.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {statusSteps.map((status, index) => {
            const config = deliveryStatusConfig[status as keyof typeof deliveryStatusConfig];
            const Icon = config.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status} className="flex flex-col items-center relative">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${isActive ? config.bg : 'bg-gray-600'}
                  ${isCurrent ? 'ring-2 ring-white' : ''}
                `}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-center">{config.label}</span>
                {index < statusSteps.length - 1 && (
                  <div className={`
                    absolute top-5 left-1/2 transform -translate-y-1/2 w-full h-1
                    ${index < currentIndex ? 'bg-green-500' : 'bg-gray-600'}
                  `} style={{ zIndex: -1 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Delivery Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Estimated Delivery:</span>
            <span className="font-semibold">
              {deliveryOrder.estimatedDeliveryTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          {deliveryOrder.driverName && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-300">Driver:</span>
                <span className="font-semibold">{deliveryOrder.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Contact:</span>
                <span className="font-semibold">{deliveryOrder.driverPhone}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-300">Delivery Address:</span>
            <span className="font-semibold text-right">{deliveryOrder.deliveryAddress}</span>
          </div>
        </div>

        {/* Live Updates */}
        {currentStatus === 'picked_up' && (
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-200">
              🚚 Your order is on the way! The driver will contact you when they arrive.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};