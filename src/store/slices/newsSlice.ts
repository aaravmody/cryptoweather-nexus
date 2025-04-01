import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface NewsData {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  published_at: string;
  source: {
    name: string;
  };
}

interface NewsState {
  data: NewsData[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchNewsData = createAsyncThunk(
  'news/fetchNewsData',
  async (keywords: string[] = ['cryptocurrency', 'weather']) => {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${keywords.join(
        ' OR '
      )}&language=en&category=technology,business`
    );
    return response.data.results;
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news data';
      });
  },
});

export default newsSlice.reducer; 