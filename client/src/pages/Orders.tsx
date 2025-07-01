import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { QRDisplay } from '@/components/QRDisplay';
import { OrderTracking } from '@/components/OrderTracking';
import { useAuth } from '@/hooks/useAuth';
import { useLiveOrders, useOrderTracking } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Sample orders data while Firebase permissions are configured
  const sampleOrders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      status: 'ready',
      total: 150,
      userId: user?.firebaseUid,
      items: [
        { name: 'Adobo Rice Bowl', quantity: 1, price: 85 },
        { name: 'Mango Shake', quantity: 1, price: 55 }
      ],
      createdAt: new Date(),
      canteenName: 'Main Canteen'
    },
    {
      id: '2',
      orderNumber: 'ORD-002', 
      status: 'preparing',
      total: 75,
      userId: user?.firebaseUid,
      items: [
        { name: 'Pancit Canton', quantity: 1, price: 75 }
      ],
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      canteenName: 'Engineering Canteen'
    }
  ];

  const loading = false;
  const userOrders = sampleOrders;
  const activeOrders = userOrders.filter(order => 
    ['pending', 'preparing', 'ready'].includes(order.status)
  );
  const completedOrders = userOrders.filter(order => 
    ['completed', 'cancelled'].includes(order.status)
  );
  const selectedOrder = selectedOrderId ? userOrders.find(order => order.id === selectedOrderId) : null;
  const orderLoading = false;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <LoadingSpinner size="sm" />;
      case 'ready':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOrderId(order.id)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
            <p className="text-sm text-gray-600">
              {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
            </p>
          </div>
          <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </Badge>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          {order.items?.length ? `${order.items.length} items` : 'Multiple items'}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary text-lg">
            ₱{parseFloat(order.total).toFixed(0)}
          </span>
          <Button size="sm" variant="outline">
            <QrCode className="w-4 h-4 mr-1" />
            View QR
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
            My Orders
          </h1>
          <p className="text-xl text-gray-600">Track your current and past orders</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
                <TabsTrigger value="history">History ({completedOrders.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {activeOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
                      <p className="text-gray-600 mb-6">You don't have any active orders right now</p>
                      <Button 
                        className="bg-primary hover:bg-primary-dark text-white"
                        onClick={() => window.location.href = '/menu'}
                      >
                        Start Ordering
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  activeOrders.map(order => <OrderCard key={order.id} order={order} />)
                )}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                {completedOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Order History</h3>
                      <p className="text-gray-600">Your completed orders will appear here</p>
                    </CardContent>
                  </Card>
                ) : (
                  completedOrders.map(order => <OrderCard key={order.id} order={order} />)
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrderId ? (
              <div className="space-y-6">
                <OrderTracking order={selectedOrder} loading={orderLoading} />
                {selectedOrder && (
                  <QRDisplay 
                    order={selectedOrder}
                    onDownload={() => console.log('Download QR')}
                    onShare={() => console.log('Share QR')}
                  />
                )}
              </div>
            ) : (
              <Card className="glass-morphism">
                <CardContent className="p-12 text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Order</h3>
                  <p className="text-gray-600">Click on an order to view details and QR code</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
