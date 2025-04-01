'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export function NewsSection() {
  const { data: newsData, loading, error } = useSelector(
    (state: RootState) => state.news
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-4">
        {error}
      </div>
    );
  }

  if (!newsData || newsData.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-4">
        No news available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsData.map((news) => (
        <Link
          key={news.url}
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <div className="flex items-start space-x-4">
            {news.image_url && (
              <img
                src={news.image_url}
                alt={news.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {news.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {news.description}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{news.source_id}</span>
                <span className="mx-2">•</span>
                <span>{new Date(news.pubDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 