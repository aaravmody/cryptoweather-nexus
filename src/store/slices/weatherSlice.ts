import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '@/services/api';

interface WeatherData {
  id: number;
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface WeatherState {
  data: WeatherData[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (cities: string[]) => {
    try {
      console.log('Fetching weather data for cities:', cities);
      const promises = cities.map((city) => weatherApi.getCurrentWeather(city));
      const responses = await Promise.all(promises);
      console.log('Weather data received:', responses);
      return responses;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
      }
      throw new Error('Failed to fetch weather data');
    }
  }
);

export const fetchWeatherForecast = createAsyncThunk(
  'weather/fetchWeatherForecast',
  async (city: string) => {
    try {
      console.log('Fetching weather forecast for city:', city);
      const data = await weatherApi.getForecast(city);
      console.log('Weather forecast received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch weather forecast: ${error.message}`);
      }
      throw new Error('Failed to fetch weather forecast');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      })
      .addCase(fetchWeatherForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherForecast.fulfilled, (state, action) => {
        state.loading = false;
        // Handle forecast data as needed
      })
      .addCase(fetchWeatherForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather forecast';
      });
  },
});

export default weatherSlice.reducer; 