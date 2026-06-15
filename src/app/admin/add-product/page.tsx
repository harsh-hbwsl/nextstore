import type { Metadata } from 'next';
import AddProductForm from '@/components/AddProductForm';

export const metadata: Metadata = { title: 'Add Product' };

export default function AddProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Add New Product</h1>
      <p className="text-gray-500 mb-8">
        Fill in the details below to add a product to the store.
      </p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <AddProductForm />
      </div>
    </div>
  );
}
