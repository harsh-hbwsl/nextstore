'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM: FormData = {
  title: '',
  description: '',
  price: '',
  category: '',
  image: '',
};

export default function AddProductForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Dynamic Categories from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoadingCats(false);
      })
      .catch(() => {
        // Fallbacks
        setCategories([
          { id: 'cat-1', name: 'Electronics',      slug: 'electronics',      emoji: '💻', isDefault: true, createdAt: '' },
          { id: 'cat-2', name: 'Jewelery',          slug: 'jewelery',         emoji: '💍', isDefault: true, createdAt: '' },
          { id: 'cat-3', name: "Men's Clothing",    slug: "men's clothing",   emoji: '👔', isDefault: true, createdAt: '' },
          { id: 'cat-4', name: "Women's Clothing",  slug: "women's clothing", emoji: '👗', isDefault: true, createdAt: '' },
        ]);
        setLoadingCats(false);
      });
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim())
      newErrors.description = 'Description is required.';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Enter a valid price greater than 0.';
    if (!formData.category) newErrors.category = 'Select a category.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'image') setImageError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      setSuccess(true);
      setFormData(INITIAL_FORM);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────
  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-green-600 dark:text-green-400">✓</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Product Added!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
          Your product has been saved successfully and is now stored.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Add Another
          </button>
          <a
            href="/admin/products"
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold"
          >
            View Products
          </a>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          ⚠️ {serverError}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          className={`w-full px-4 py-3 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-300 bg-red-50 dark:border-red-900/20 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-700'
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the product features, materials, benefits..."
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? 'border-red-300 bg-red-50 dark:border-red-900/20 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-700'
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price + Category row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`w-full px-4 py-3 border rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-300 bg-red-50 dark:border-red-900/20 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-700'
            }`}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loadingCats}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
              errors.category ? 'border-red-300 bg-red-50 dark:border-red-900/20 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <option value="">{loadingCats ? 'Loading categories...' : 'Select category...'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug} className="capitalize">
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Image URL{' '}
          <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/product-image.jpg"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Live image preview */}
        {formData.image && !imageError && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <img
              src={formData.image}
              alt="Preview"
              className="w-14 h-14 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-1"
              onError={() => setImageError(true)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Image preview</p>
          </div>
        )}
        {imageError && (
          <p className="text-amber-600 text-xs mt-1">
            ⚠️ Could not load image. Check the URL.
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || loadingCats}
        className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Adding Product...
          </span>
        ) : (
          '+ Add Product'
        )}
      </button>
    </form>
  );
}
