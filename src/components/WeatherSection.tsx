'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export function WeatherSection() {
  const { data: weatherData, loading, error } = useSelector(
    (state: RootState) => state.weather
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
        <p className="font-semibold">Error loading weather data</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">Please check your OpenWeather API key configuration</p>
      </div>
    );
  }

  if (!weatherData || weatherData.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-4">
        <p>No weather data available</p>
        <p className="text-sm mt-1">Please check your OpenWeather API key configuration</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {weatherData.map((city) => (
        <Link
          key={city.name}
          href={`/city/${city.name}`}
          className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {city.name}
            </h3>
            <img
              src={`http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
              alt={city.weather[0].description}
              className="w-12 h-12"
            />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(city.main.temp)}°C
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {city.weather[0].description}
            </p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Humidity: {city.main.humidity}%</span>
              <span>Wind: {city.wind.speed} m/s</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 