# CryptoWeather Nexus

A modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications via WebSocket.

## Features

- Real-time cryptocurrency price updates via WebSocket
- Weather information for multiple cities
- Crypto market data and trends
- Latest crypto-related news
- Detailed views for both weather and cryptocurrency data
- Favorite cities and cryptocurrencies
- Dark mode support
- Responsive design for all screen sizes
- Real-time notifications for significant price changes and weather alerts

## Tech Stack

- Next.js 13+ with App Router
- React with Hooks
- Redux Toolkit for state management
- Tailwind CSS for styling
- Recharts for data visualization
- WebSocket for real-time updates
- TypeScript for type safety

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18.x or later
- npm or yarn
- API keys for:
  - OpenWeatherMap API
  - NewsData.io API

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cryptoweather-nexus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── crypto/            # Crypto detail pages
│   ├── weather/           # Weather detail pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── providers.tsx      # Redux provider
├── components/            # React components
│   ├── Navigation.tsx
│   ├── WeatherSection.tsx
│   ├── CryptoSection.tsx
│   └── NewsSection.tsx
├── store/                # Redux store and slices
│   ├── store.ts
│   └── slices/
└── utils/                # Utility functions
```

## Design Decisions

1. **App Router**: Using Next.js 13+ App Router for better performance and SEO.
2. **Redux Toolkit**: Chosen for its simplified Redux setup and built-in tools.
3. **WebSocket Integration**: Direct WebSocket connection for real-time crypto prices.
4. **Responsive Design**: Mobile-first approach using Tailwind CSS.
5. **Dark Mode**: Built-in dark mode support for better user experience.
6. **Error Handling**: Comprehensive error states and loading indicators.
7. **Type Safety**: TypeScript for better development experience and fewer runtime errors.

## API Integration

- **Weather Data**: OpenWeatherMap API for current weather and forecasts
- **Crypto Data**: CoinGecko API for market data and CoinCap WebSocket for real-time prices
- **News Data**: NewsData.io for crypto-related news

## Deployment

The application is deployed on Vercel and can be accessed at: [your-deployment-url]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
