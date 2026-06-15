import type { Metadata } from 'next';
import AddProductForm from '@/components/AddProductForm';

export const metadata: Metadata = { title: 'Add Product' };

export default function AddProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">Add New Product</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Fill in the details below to add a product to the store.
      </p>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <AddProductForm />
      </div>
    </div>
  );
}
