import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface CryptoState {
  data: CryptoData[];
  loading: boolean;
  error: string | null;
  websocketConnected: boolean;
}

const initialState: CryptoState = {
  data: [],
  loading: false,
  error: null,
  websocketConnected: false,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (cryptoIds: string[]) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(
        ','
      )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    return response.data;
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
        crypto.current_price = price;
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
      });
  },
});

export const { setWebSocketStatus, updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer; 