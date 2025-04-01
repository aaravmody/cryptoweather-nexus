'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchWeatherData, fetchWeatherForecast } from '@/store/slices/weatherSlice';
import { Navigation } from '@/components/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CityDetailPage({
  params,
}: {
  params: { name: string };
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: weatherData, loading, error } = useSelector(
    (state: RootState) => state.weather
  );
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchWeatherData([params.name]));
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${params.name}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.list) {
          setForecastData(
            data.list.map((item: any) => ({
              timestamp: new Date(item.dt * 1000).getTime(),
              temperature: item.main.temp,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
              conditions: item.weather[0].description,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching forecast:', err);
      }
    };
    fetchForecast();
  }, [dispatch, params.name]);

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
            <div className="text-red-500">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  const city = weatherData?.find((w) => w.name === params.name);

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-gray-500 dark:text-gray-400">
              City not found
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
            Weather in {city.name}
          </h1>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Current Weather
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Temperature: {Math.round(city.main.temp)}°C
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Feels Like: {Math.round(city.main.feels_like)}°C
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Humidity: {city.main.humidity}%
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Wind Speed: {city.wind.speed} m/s
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Conditions: {city.weather[0].description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <img
                    src={`http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                    alt={city.weather[0].description}
                    className="w-32 h-32"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  5-Day Forecast
                </h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData}>
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 