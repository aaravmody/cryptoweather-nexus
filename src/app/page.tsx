'use client';

import Navigation from '@/components/Navigation';
import WeatherSection from '@/components/WeatherSection';
import CryptoSection from '@/components/CryptoSection';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Weather Section */}
            <div className="col-span-1">
              <WeatherSection />
            </div>

            {/* Crypto Section */}
            <div className="col-span-1">
              <CryptoSection />
            </div>

            {/* News Section */}
            <div className="col-span-1 lg:col-span-1">
              <NewsSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 