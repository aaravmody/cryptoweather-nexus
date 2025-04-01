'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface WeatherHistory {
  timestamp: number;
  temperature: number;
  humidity: number;
  conditions: string;
}

export default function WeatherDetail() {
  const params = useParams();
  const city = decodeURIComponent(params.city as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherHistory[]>([]);

  useEffect(() => {
    const fetchWeatherHistory = async () => {
      try {
        // For demo purposes, we'll generate mock historical data
        const now = Date.now();
        const mockData = Array.from({ length: 24 }, (_, i) => {
          const timestamp = now - (23 - i) * 3600 * 1000;
          return {
            timestamp,
            temperature: 20 + Math.random() * 10 - 5,
            humidity: 50 + Math.random() * 20 - 10,
            conditions: ['Clear', 'Cloudy', 'Rain', 'Sunny'][Math.floor(Math.random() * 4)],
          };
        });
        setWeatherData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather history');
        setLoading(false);
      }
    };

    fetchWeatherHistory();
  }, [city]);

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

  if (error) {
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Weather History for {city}
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weatherData}>
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
                <YAxis yAxisId="temp" name="Temperature" unit="°C" />
                <YAxis yAxisId="humidity" orientation="right" name="Humidity" unit="%" />
                <Tooltip
                  labelFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
                />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  name="Temperature"
                  unit="°C"
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#82ca9d"
                  name="Humidity"
                  unit="%"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData.slice(-3).map((data) => (
                <div
                  key={data.timestamp}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(data.timestamp).toLocaleString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="mt-2 text-gray-900 dark:text-white">
                    <div>{Math.round(data.temperature)}°C</div>
                    <div>{data.humidity}% humidity</div>
                    <div className="capitalize">{data.conditions}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 