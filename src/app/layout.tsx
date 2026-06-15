import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
