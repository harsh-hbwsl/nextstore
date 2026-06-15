import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🛒</div>
      <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back to shopping.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl hover:border-blue-300 transition-colors font-semibold"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
