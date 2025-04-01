import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/store/provider';
import { ThemeProvider } from '@/context/ThemeContext';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoWeather Nexus',
  description: 'Your one-stop dashboard for cryptocurrency and weather information',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col`}>
        <ThemeProvider>
          <Providers>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <Toaster position="top-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
} 