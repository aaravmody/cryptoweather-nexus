import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[];
  cryptos: string[];
}

const initialState: FavoritesState = {
  cities: ['New York', 'London', 'Tokyo'],
  cryptos: ['bitcoin', 'ethereum', 'solana'],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const city = action.payload;
      const index = state.cities.indexOf(city);
      if (index === -1) {
        state.cities.push(city);
      } else {
        state.cities.splice(index, 1);
      }
    },
    toggleFavoriteCrypto: (state, action: PayloadAction<string>) => {
      const crypto = action.payload;
      const index = state.cryptos.indexOf(crypto);
      if (index === -1) {
        state.cryptos.push(crypto);
      } else {
        state.cryptos.splice(index, 1);
      }
    },
    addCity: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter(city => city !== action.payload);
    },
    addCrypto: (state, action: PayloadAction<string>) => {
      if (!state.cryptos.includes(action.payload)) {
        state.cryptos.push(action.payload);
      }
    },
    removeCrypto: (state, action: PayloadAction<string>) => {
      state.cryptos = state.cryptos.filter(crypto => crypto !== action.payload);
    },
  },
});

export const {
  toggleFavoriteCity,
  toggleFavoriteCrypto,
  addCity,
  removeCity,
  addCrypto,
  removeCrypto,
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 