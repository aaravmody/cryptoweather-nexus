'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCryptoData, fetchCryptoHistory } from '@/store/slices/cryptoSlice';
import { Navigation } from '@/components/Navigation';

export default function CryptoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: cryptoData, history, loading, error } = useSelector(
    (state: RootState) => state.crypto
  );

  useEffect(() => {
    dispatch(fetchCryptoData([params.id]));
    dispatch(fetchCryptoHistory({ id: params.id, days: 7 }));
  }, [dispatch, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-red-500 dark:text-red-400">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  const crypto = Array.isArray(cryptoData) ? cryptoData.find((c) => c.id === params.id) : null;
  const priceHistory = history[params.id]?.prices || [];

  if (!crypto) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-gray-500 dark:text-gray-400">
              Cryptocurrency not found
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {crypto.name} ({crypto.symbol.toUpperCase()})
          </h1>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Price Information
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Current Price: ${crypto.current_price.toLocaleString()}
                  </p>
                  <p
                    className={`${
                      crypto.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    24h Change: {crypto.price_change_percentage_24h.toFixed(2)}%
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Market Cap: ${crypto.market_cap.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Add price chart component here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 