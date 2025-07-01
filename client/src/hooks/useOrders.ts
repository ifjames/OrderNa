import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMenuItems, 
  createOrder, 
  getUserOrders, 
  updateOrderStatus,
  subscribeToOrders,
  subscribeToOrder 
} from '@/lib/firebase';
import { generateQRCode, generateOrderQRData } from '@/lib/qr';
import { CartItem } from '@shared/schema';

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['/api/menu-items'],
    queryFn: getMenuItems,
  });
};

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['/api/orders', userId],
    queryFn: () => getUserOrders(userId),
    enabled: !!userId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderData, cartItems }: { orderData: any; cartItems: CartItem[] }) => {
      const orderNumber = `ORD-${Date.now()}`;
      const qrData = generateOrderQRData(orderNumber, orderData.userId);
      const qrCode = await generateQRCode(qrData);
      
      const order = await createOrder({
        ...orderData,
        orderNumber,
        qrCode,
        items: cartItems,
      });
      
      return { ...order, qrCodeImage: qrCode };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
  });
};

export const useLiveOrders = (filters?: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    }, filters);

    return unsubscribe;
  }, [filters]);

  return { orders, loading };
};

export const useOrderTracking = (orderId: string) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = subscribeToOrder(orderId, (updatedOrder) => {
      setOrder(updatedOrder);
      setLoading(false);
    });

    return unsubscribe;
  }, [orderId]);

  return { order, loading };
};
