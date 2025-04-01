import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              404 - Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 