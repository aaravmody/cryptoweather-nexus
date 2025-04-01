'use client';

import { Navigation } from '@/components/Navigation';
import { NewsSection } from '@/components/NewsSection';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Crypto & Weather News
        </h1>
        <NewsSection />
      </main>
    </div>
  );
} 