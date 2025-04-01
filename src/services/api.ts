import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

// Weather API
export const weatherApi = {
  getCurrentWeather: async (city: string) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  },

  getForecast: async (city: string) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  },
};

// Crypto API
export const cryptoApi = {
  getCryptoData: async (ids: string[]) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );
    return response.data;
  },

  getCryptoHistory: async (id: string, days: number = 7) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    return response.data;
  },
};

// News API
export const newsApi = {
  getCryptoNews: async () => {
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&q=cryptocurrency&language=en&category=business`
    );
    return response.data;
  },
}; 