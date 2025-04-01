'use client';

import toast from 'react-hot-toast';

interface NotificationOptions {
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
}

export const showNotification = ({ type, message, description }: NotificationOptions) => {
  const content = description ? `${message}\n${description}` : message;

  switch (type) {
    case 'success':
      toast.success(content);
      break;
    case 'error':
      toast.error(content);
      break;
    case 'info':
      toast(content);
      break;
    default:
      toast(content);
  }
};

export const showPriceAlert = (crypto: string, price: number, change: number) => {
  const isIncrease = change > 0;
  const message = `${crypto} Price ${isIncrease ? 'Up' : 'Down'}`;
  const description = `${isIncrease ? '📈' : '📉'} Now at $${price.toLocaleString()} (${change.toFixed(2)}%)`;

  showNotification({
    type: 'info',
    message,
    description,
  });
};

export const showWeatherAlert = (city: string, condition: string, temperature: number) => {
  showNotification({
    type: 'info',
    message: `Weather Alert: ${city}`,
    description: `${condition} - Temperature: ${temperature}°C`,
  });
}; 