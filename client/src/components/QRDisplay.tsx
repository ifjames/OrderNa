import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { generateQRCode } from '@/lib/qr';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface QRDisplayProps {
  order: any;
  onDownload?: () => void;
  onShare?: () => void;
}

export const QRDisplay = ({ order, onDownload, onShare }: QRDisplayProps) => {
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order?.qrCode) {
      generateQRCode(order.qrCode)
        .then(setQrCodeImage)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [order?.qrCode]);

  const handleDownload = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.download = `order-${order.orderNumber}-qr.png`;
      link.href = qrCodeImage;
      link.click();
    }
    onDownload?.();
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeImage) {
      try {
        const response = await fetch(qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], `order-${order.orderNumber}-qr.png`, { type: 'image/png' });
        
        await navigator.share({
          title: 'OrderNa QR Code',
          text: `Order #${order.orderNumber}`,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    onShare?.();
  };

  if (!order) return null;

  return (
    <Card className="glass-morphism-dark text-white max-w-md mx-auto shadow-2xl border-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-poppins text-shadow">Your Order QR Code</CardTitle>
        <p className="text-gray-300 text-lg font-medium">Show this at the canteen counter</p>
      </CardHeader>
      <CardContent className="text-center px-8">
        <div className="bg-white/95 rounded-3xl p-8 mb-8 shadow-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden">
          {loading ? (
            <div className="w-52 h-52 mx-auto flex items-center justify-center">
              <div className="relative">
                <LoadingSpinner size="lg" />
                <div className="absolute inset-0 loading-shimmer rounded-full"></div>
              </div>
            </div>
          ) : qrCodeImage ? (
            <div className="relative">
              <img 
                src={qrCodeImage} 
                alt={`QR Code for order ${order.orderNumber}`}
                className="w-52 h-52 mx-auto qr-pulse rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-xl"></div>
            </div>
          ) : (
            <div className="w-52 h-52 mx-auto bg-gray-100 rounded-xl flex items-center justify-center shadow-inner">
              <p className="text-gray-500 font-medium">QR Code unavailable</p>
            </div>
          )}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700 font-mono font-bold tracking-wider">{order.orderNumber}</p>
          </div>
        </div>

        <div className="space-y-3 text-left mb-6">
          <div className="flex justify-between">
            <span className="text-gray-300">Order ID:</span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total:</span>
            <span className="font-semibold text-primary">₱{parseFloat(order.total).toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pickup Time:</span>
            <span className="font-semibold">{order.pickupTime || 'ASAP'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Status:</span>
            <span className="font-semibold text-yellow-400 capitalize">{order.status}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={handleDownload}
            className="flex-1 btn-modern shadow-xl"
            disabled={!qrCodeImage}
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1 glass-morphism-light text-gray-900 border-white/30 hover:bg-white/30 shadow-xl transition-all duration-300"
            disabled={!qrCodeImage}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
