'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchNewsData } from '@/store/slices/newsSlice';

export default function NewsSection() {
  const dispatch = useDispatch();
  const { data: newsData, loading, error } = useSelector((state: RootState) => state.news);

  useEffect(() => {
    dispatch(fetchNewsData() as any);
    const interval = setInterval(() => {
      dispatch(fetchNewsData() as any);
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest News</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest News</h2>
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest News</h2>
      <div className="space-y-4">
        {newsData.slice(0, 5).map((news) => (
          <a
            key={news.url}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2">
              {news.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {news.description}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{news.source.name}</span>
              <span>{formatDate(news.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 