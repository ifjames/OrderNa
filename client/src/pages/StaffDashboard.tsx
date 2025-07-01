import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRScanner } from '@/components/QRScanner';
import { useLiveOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useNotifications } from '@/components/ui/notification';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Clock, Users, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { parseQRData } from '@/lib/qr';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('queue');
  const { orders, loading } = useLiveOrders();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const { addNotification } = useNotifications();

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const completedToday = orders.filter(order => 
    order.status === 'completed' && 
    new Date(order.createdAt?.seconds * 1000).toDateString() === new Date().toDateString()
  );

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          addNotification(`Order marked as ${newStatus}!`, 'success');
        },
        onError: () => {
          addNotification('Failed to update order status', 'error');
        },
      }
    );
  };

  const handleQRScan = (qrData: any) => {
    const parsedData = parseQRData(qrData);
    const order = orders.find(o => o.orderNumber === parsedData.orderNumber);
    
    if (order) {
      if (order.status === 'ready') {
        handleOrderStatusUpdate(order.id, 'completed');
        addNotification(`Order ${order.orderNumber} completed!`, 'success');
      } else {
        addNotification(`Order ${order.orderNumber} is not ready for pickup yet`, 'warning');
      }
    } else {
      addNotification('Order not found', 'error');
    }
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="border-l-4 border-l-yellow-400">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900">{order.orderNumber}</span>
            <Badge className={`${getStatusColor(order.status)} text-xs`}>
              {order.status}
            </Badge>
          </div>
          <span className="text-sm text-gray-500">
            {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString() : 'Just now'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          {order.items?.length ? `${order.items.length} items` : 'Multiple items'} • 
          Pickup: {order.pickupTime || 'ASAP'}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary">₱{parseFloat(order.total).toFixed(0)}</span>
          <div className="flex space-x-2">
            {order.status === 'pending' && (
              <Button
                size="sm"
                onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Start Preparing
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button
                size="sm"
                onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Mark Ready
              </Button>
            )}
            <Button size="sm" variant="outline">
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
            Staff Dashboard
          </h1>
          <p className="text-xl text-gray-600">Manage incoming orders and track preparation</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{pendingOrders.length}</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Clock className="w-4 h-4 mr-1" />
                Pending Orders
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{preparingOrders.length}</div>
              <div className="text-gray-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-1" />
                Preparing
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{readyOrders.length}</div>
              <div className="text-gray-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Ready for Pickup
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-600 mb-2">{completedToday.length}</div>
              <div className="text-gray-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed Today
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Orders Queue */}
          <Card className="glass-morphism">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-poppins">Live Orders Queue</CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                  <TabsTrigger value="preparing">Preparing ({preparingOrders.length})</TabsTrigger>
                  <TabsTrigger value="ready">Ready ({readyOrders.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-4">
                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No pending orders
                    </div>
                  ) : (
                    pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </TabsContent>
                
                <TabsContent value="preparing" className="space-y-4">
                  {preparingOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No orders being prepared
                    </div>
                  ) : (
                    preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </TabsContent>
                
                <TabsContent value="ready" className="space-y-4">
                  {readyOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No orders ready for pickup
                    </div>
                  ) : (
                    readyOrders.map(order => <OrderCard key={order.id} order={order} />)
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* QR Scanner */}
          <div>
            <QRScanner
              onScan={handleQRScan}
              onError={(error) => addNotification(error, 'error')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
