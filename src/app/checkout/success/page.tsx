'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-UNKNOWN';

  return (
    <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-xl">
      <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={54} />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Order Confirmed!
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Thank you for your purchase. We have received your order and are processing it.
      </p>

      <div className="bg-slate-50 dark:bg-gray-800 p-4 rounded-xl mb-8 border border-slate-100 dark:border-gray-700/50">
        <p className="text-xs text-gray-450 uppercase font-semibold tracking-wider mb-1">
          Order Reference
        </p>
        <p className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
          #{orderId}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-450 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mt-2"
        >
          Go to Home
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <span className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
