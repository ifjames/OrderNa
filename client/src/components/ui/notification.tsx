import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export const Notification = ({ 
  message, 
  type, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = iconMap[type];

  useEffect(() => {
    setIsVisible(true);
    
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className={`glass-morphism-dark text-white p-4 rounded-xl shadow-2xl max-w-sm transform transition-all duration-500 ${
      isVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-full scale-95 opacity-0'
    } border border-white/20 backdrop-blur-xl`}>
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-green-500/20' :
          type === 'error' ? 'bg-red-500/20' :
          type === 'warning' ? 'bg-yellow-500/20' :
          'bg-blue-500/20'
        }`}>
          <Icon className={`w-4 h-4 ${colorMap[type]}`} />
        </div>
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-lg p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([]);

  const addNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id, onClose: () => removeNotification(id) }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
};

export const NotificationContainer = ({ notifications }: { notifications: Array<NotificationProps & { id: string }> }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );
};
