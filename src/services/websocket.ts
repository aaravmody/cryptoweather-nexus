import { io, Socket } from 'socket.io-client';
import { showPriceAlert, showWeatherAlert } from '@/utils/notifications';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket) return;

    // Connect to CoinCap WebSocket
    this.socket = io('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana');

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    });

    this.socket.on('price', (data: any) => {
      Object.entries(data).forEach(([crypto, price]: [string, any]) => {
        showPriceAlert(crypto, parseFloat(price), 0); // Change will be calculated in the component
      });
    });

    // Simulate weather alerts
    this.simulateWeatherAlerts();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 5000 * this.reconnectAttempts);
    }
  }

  private simulateWeatherAlerts() {
    const cities = ['New York', 'London', 'Tokyo'];
    const conditions = ['Rain', 'Sunny', 'Cloudy', 'Storm'];
    
    setInterval(() => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 10;
      
      showWeatherAlert(randomCity, randomCondition, randomTemp);
    }, 300000); // Every 5 minutes
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService(); 