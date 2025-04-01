import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface NewsItem {
  url: string;
  title: string;
  description: string;
  image_url: string;
  source_id: string;
  pubDate: string;
}

interface NewsState {
  data: NewsItem[] | null;
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
    if (!apiKey) {
      throw new Error('NewsData API key is not configured');
    }
    const response = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${keywords.join(
        ' OR '
      )}&language=en&category=technology,business`
    );
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid response from NewsData API');
    }

    return response.data.results.map((item: any) => ({
      url: item.link || '#',
      title: item.title || 'No title',
      description: item.description || 'No description available',
      image_url: item.image_url || '',
      source_id: item.source_id || 'Unknown source',
      pubDate: item.pubDate || new Date().toISOString(),
    }));
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