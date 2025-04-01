'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { fetchCryptoData } from '@/store/slices/cryptoSlice';
import { fetchNewsData } from '@/store/slices/newsSlice';
import { Navigation } from '@/components/Navigation';
import { WeatherSection } from '@/components/WeatherSection';
import { CryptoSection } from '@/components/CryptoSection';
import { NewsSection } from '@/components/NewsSection';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchWeatherData(['London', 'New York', 'Tokyo']));
    dispatch(fetchCryptoData(['bitcoin', 'ethereum', 'cardano']));
    dispatch(fetchNewsData(['cryptocurrency', 'weather']));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Welcome to CryptoWeather Nexus
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Weather Dashboard
                  </h2>
                  <WeatherSection />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Cryptocurrency Dashboard
                  </h2>
                  <CryptoSection />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Latest News
                </h2>
                <NewsSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 