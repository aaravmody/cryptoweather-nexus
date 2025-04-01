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

interface CryptoHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface CryptoState {
  data: CryptoData[];
  history: Record<string, CryptoHistory>;
  loading: boolean;
  error: string | null;
  websocketConnected: boolean;
}

const initialState: CryptoState = {
  data: [],
  history: {},
  loading: false,
  error: null,
  websocketConnected: false,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (ids: string[]) => {
    try {
      return await cryptoApi.getCryptoData(ids);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch crypto data: ${error.message}`);
      }
      throw new Error('Failed to fetch crypto data');
    }
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async (id: string) => {
    try {
      return await cryptoApi.getCryptoHistory(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch crypto history: ${error.message}`);
      }
      throw new Error('Failed to fetch crypto history');
    }
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
          [action.meta.arg]: action.payload
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