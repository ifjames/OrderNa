import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateOrderQRData = (orderNumber: string, orderId: string): string => {
  return JSON.stringify({
    type: 'order',
    orderNumber,
    orderId,
    timestamp: Date.now()
  });
};

export const parseQRData = (qrData: string) => {
  try {
    return JSON.parse(qrData);
  } catch (error) {
    // If it's not JSON, treat it as a simple string (order number)
    return { orderNumber: qrData };
  }
};
