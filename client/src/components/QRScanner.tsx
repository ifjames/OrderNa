import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Square } from 'lucide-react';
import { parseQRData } from '@/lib/qr';

interface QRScannerProps {
  onScan: (data: any) => void;
  onError?: (error: string) => void;
}

export const QRScanner = ({ onScan, onError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      onError?.('Failed to access camera. Please check permissions.');
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualLookup = () => {
    if (manualInput.trim()) {
      const parsedData = parseQRData(manualInput.trim());
      onScan(parsedData);
      setManualInput('');
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="text-xl font-poppins flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          {isScanning ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-sm mx-auto rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Square className="w-32 h-32 text-white/50" strokeWidth={1} />
              </div>
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">Position QR code in frame</p>
                <p className="text-xs text-gray-500 mt-2">Camera will activate automatically</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!isScanning ? (
            <Button 
              onClick={startScanner}
              className="w-full gradient-bg text-white hover:opacity-90"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Scanner
            </Button>
          ) : (
            <Button 
              onClick={stopScanner}
              variant="destructive"
              className="w-full"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Scanner
            </Button>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Or enter order ID manually:</p>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="ORD-2024-001"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleManualLookup}
                className="bg-primary hover:bg-primary-dark text-white"
                disabled={!manualInput.trim()}
              >
                Lookup
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
