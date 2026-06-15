import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from 'next-themes';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NextStore — Your One-Stop Shop',
    template: '%s | NextStore',
  },
  description:
    'Browse thousands of products at unbeatable prices. Electronics, fashion, jewellery, and more.',
  keywords: ['ecommerce', 'online store', 'shopping', 'products', 'NextStore'],
  openGraph: {
    type: 'website',
    siteName: 'NextStore',
    title: 'NextStore — Your One-Stop Shop',
    description: 'Browse thousands of products at unbeatable prices.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-150 transition-colors duration-200`}>
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
