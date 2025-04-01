'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function CryptoSection() {
  const { data: cryptoData, loading, error } = useSelector(
    (state: RootState) => state.crypto
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-4">
        {error}
      </div>
    );
  }

  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-4">
        No cryptocurrency data available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cryptoData.map((crypto) => (
        <Link
          key={crypto.id}
          href={`/crypto/${crypto.id}`}
          className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {crypto.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {crypto.symbol.toUpperCase()}
              </p>
            </div>
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${crypto.current_price.toLocaleString()}
            </p>
            <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </p>
            {crypto.sparkline_in_7d?.price && crypto.sparkline_in_7d.price.length > 0 && (
              <div className="h-20 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crypto.sparkline_in_7d.price.map((price, index) => ({
                    time: index,
                    price: price
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={crypto.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444'}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
} 