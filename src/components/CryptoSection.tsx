'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchCryptoData, setWebSocketStatus, updateCryptoPrice } from '@/store/slices/cryptoSlice';
import { toggleFavoriteCrypto } from '@/store/slices/favoritesSlice';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { showPriceAlert } from '@/utils/notifications';

const DEFAULT_CRYPTOS = ['bitcoin', 'ethereum', 'cardano'];

export default function CryptoSection() {
  const dispatch = useDispatch();
  const { data: cryptoData, loading, error, websocketConnected } = useSelector(
    (state: RootState) => state.crypto
  );
  const favoriteCryptos = useSelector((state: RootState) => state.favorites.favoriteCryptos);

  useEffect(() => {
    dispatch(fetchCryptoData(DEFAULT_CRYPTOS) as any);
    const interval = setInterval(() => {
      dispatch(fetchCryptoData(DEFAULT_CRYPTOS) as any);
    }, 60000); // Fallback update every minute

    // WebSocket connection
    const ws = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano');

    ws.onopen = () => {
      dispatch(setWebSocketStatus(true));
    };

    ws.onclose = () => {
      dispatch(setWebSocketStatus(false));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      Object.entries(data).forEach(([id, price]) => {
        const numericPrice = parseFloat(price as string);
        const crypto = cryptoData.find((c) => c.id === id);
        if (crypto) {
          const priceChange = ((numericPrice - crypto.current_price) / crypto.current_price) * 100;
          if (Math.abs(priceChange) >= 1) {
            showPriceAlert(crypto.name, numericPrice, priceChange);
          }
        }
        dispatch(updateCryptoPrice({ id, price: numericPrice }));
      });
    };

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [dispatch, cryptoData]);

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleFavoriteCrypto(cryptoId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(marketCap);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cryptocurrency</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cryptocurrency</h2>
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cryptocurrency</h2>
        <div
          className={`h-2 w-2 rounded-full ${
            websocketConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={websocketConnected ? 'Live updates active' : 'Live updates inactive'}
        />
      </div>
      <div className="space-y-4">
        {cryptoData.map((crypto) => (
          <Link
            key={crypto.id}
            href={`/crypto/${crypto.id}`}
            className="block"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </h3>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
                  <span>{formatPrice(crypto.current_price)}</span>
                  <span
                    className={`${
                      crypto.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Market Cap: {formatMarketCap(crypto.market_cap)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleFavorite(crypto.id);
                }}
                className="text-gray-400 hover:text-yellow-500 focus:outline-none"
              >
                {favoriteCryptos.includes(crypto.id) ? (
                  <StarIconSolid className="h-6 w-6 text-yellow-500" />
                ) : (
                  <StarIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 