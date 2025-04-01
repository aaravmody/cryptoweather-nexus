import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoApi } from '@/services/api';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface CryptoState {
  data: CryptoData[];
  loading: boolean;
  error: string | null;
  websocketConnected: boolean;
  history: {
    [key: string]: any;
  };
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
  websocketConnected: false,
  history: {},
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchData',
  async (ids: string[]) => {
    const data = await cryptoApi.getCryptoData(ids);
    return data;
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchHistory',
  async ({ id, days }: { id: string; days: number }) => {
    const data = await cryptoApi.getCryptoHistory(id, days);
    return data;
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setWebSocketStatus: (state, action) => {
      state.websocketConnected = action.payload;
    },
    updateCryptoPrice: (state, action) => {
      const { id, price } = action.payload;
      const crypto = state.data.find((c) => c.id === id);
      if (crypto) {
        const oldPrice = crypto.current_price;
        crypto.current_price = price;
        crypto.price_change_percentage_24h =
          ((price - oldPrice) / oldPrice) * 100;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = {
          ...state.history,
          [action.meta.arg.id]: action.payload
        };
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto history';
      });
  },
});

export const { setWebSocketStatus, updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer; 