'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Navigation } from '@/components/Navigation';

export default function SettingsPage() {
  const { cities: favoriteCities, cryptos: favoriteCryptos } = useSelector(
    (state: RootState) => state.favorites
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Favorite Cities
              </h2>
              {favoriteCities.length > 0 ? (
                <ul className="space-y-2">
                  {favoriteCities.map((city) => (
                    <li
                      key={city}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No favorite cities yet</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Favorite Cryptocurrencies
              </h2>
              {favoriteCryptos.length > 0 ? (
                <ul className="space-y-2">
                  {favoriteCryptos.map((crypto) => (
                    <li
                      key={crypto}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      {crypto}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No favorite cryptocurrencies yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 