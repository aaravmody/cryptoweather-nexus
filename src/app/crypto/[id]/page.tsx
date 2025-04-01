'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface CryptoHistory {
  timestamp: number;
  price: number;
  volume: number;
}

interface CryptoDetails {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

export default function CryptoDetail() {
  const params = useParams();
  const cryptoId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoDetails | null>(null);
  const [priceHistory, setPriceHistory] = useState<CryptoHistory[]>([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );

        setCryptoData({
          id: response.data.id,
          name: response.data.name,
          symbol: response.data.symbol,
          current_price: response.data.market_data.current_price.usd,
          market_cap: response.data.market_data.market_cap.usd,
          total_volume: response.data.market_data.total_volume.usd,
          price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
          market_cap_rank: response.data.market_cap_rank,
        });

        // For demo purposes, generate mock historical data
        const now = Date.now();
        const mockHistory = Array.from({ length: 24 }, (_, i) => {
          const timestamp = now - (23 - i) * 3600 * 1000;
          const basePrice = response.data.market_data.current_price.usd;
          return {
            timestamp,
            price: basePrice * (1 + (Math.random() * 0.1 - 0.05)),
            volume: response.data.market_data.total_volume.usd * (Math.random() * 0.5 + 0.75),
          };
        });
        setPriceHistory(mockHistory);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch crypto data');
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, [cryptoId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(volume);
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !cryptoData) {
    return (
      <div>
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-red-500 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Rank #{cryptoData.market_cap_rank}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      }
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip
                      labelFormatter={(timestamp) =>
                        new Date(timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      }
                      formatter={(value: number) => [formatPrice(value), 'Price']}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      name="Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Market Stats
              </h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Current Price</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatPrice(cryptoData.current_price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">24h Change</dt>
                  <dd
                    className={`text-lg font-semibold ${
                      cryptoData.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {cryptoData.price_change_percentage_24h.toFixed(2)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Market Cap</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatVolume(cryptoData.market_cap)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">24h Volume</dt>
                  <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatVolume(cryptoData.total_volume)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 