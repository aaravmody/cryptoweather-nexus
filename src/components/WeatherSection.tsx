'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchWeatherData } from '@/store/slices/weatherSlice';
import { toggleFavoriteCity } from '@/store/slices/favoritesSlice';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

const DEFAULT_CITIES = ['New York', 'London', 'Tokyo'];

export default function WeatherSection() {
  const dispatch = useDispatch();
  const { data: weatherData, loading, error } = useSelector((state: RootState) => state.weather);
  const favoriteCities = useSelector((state: RootState) => state.favorites.favoriteCities);

  useEffect(() => {
    dispatch(fetchWeatherData(DEFAULT_CITIES) as any);
    const interval = setInterval(() => {
      dispatch(fetchWeatherData(DEFAULT_CITIES) as any);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleToggleFavorite = (city: string) => {
    dispatch(toggleFavoriteCity(city));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weather</h2>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weather</h2>
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weather</h2>
      <div className="space-y-4">
        {weatherData.map((weather) => (
          <Link
            key={weather.city}
            href={`/weather/${encodeURIComponent(weather.city)}`}
            className="block"
          >
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{weather.city}</h3>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
                  <span>{Math.round(weather.temperature)}°C</span>
                  <span>|</span>
                  <span>{weather.humidity}% humidity</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{weather.conditions}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleFavorite(weather.city);
                }}
                className="text-gray-400 hover:text-yellow-500 focus:outline-none"
              >
                {favoriteCities.includes(weather.city) ? (
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