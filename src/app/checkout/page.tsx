import type { Metadata } from 'next';
import CheckoutClient from '@/components/CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your order securely at NextStore.',
};

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8">
        Secure Checkout
      </h1>
      <CheckoutClient />
    </div>
  );
}
