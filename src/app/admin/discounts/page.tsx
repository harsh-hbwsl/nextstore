'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, ToggleLeft, ToggleRight, Calendar, Tag, RefreshCw } from 'lucide-react';
import { Discount, Category, DiscountDisplayName } from '@/types';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState<DiscountDisplayName>('Special Offer');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [discRes, catRes] = await Promise.all([
        fetch('/api/discounts'),
        fetch('/api/categories'),
      ]);
      if (!discRes.ok || !catRes.ok) throw new Error();
      const discData = await discRes.json();
      const catData = await catRes.json();
      
      setDiscounts(discData);
      setCategories(catData);
    } catch {
      setError('Could not load configuration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!value || parseFloat(value) <= 0) {
      setError('Value must be greater than 0.');
      return;
    }
    if (!categorySlug) {
      setError('Please select a category.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name,
        type,
        value: parseFloat(value),
        categorySlug,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        isActive,
      };

      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create discount rule.');
      }

      setSuccess('Discount rule added successfully!');
      setValue('');
      setExpiresAt('');
      setCategorySlug('');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/discounts?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status.');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discount rule?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/discounts?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete discount rule.');
      setSuccess('Discount rule deleted.');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred.');
    }
  };

  const DISCOUNT_NAMES = [
    'Flat Discount',
    'Special Offer',
    'Flash Sale',
    'Seasonal Discount',
    'Clearance Sale',
    'Weekend Deal',
    'Buy More Save More',
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
          Discount Engine
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Create promotional rules to target specific categories with percentage or flat rate discounts.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-xl text-sm">
          ✓ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Discount Form */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-1.5">
            <Plus size={18} className="text-blue-500" />
            Add Discount Rule
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Rule Label Name
              </label>
              <select
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DISCOUNT_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Target Category
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select target category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="capitalize">
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Rule Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  required
                  placeholder={type === 'percentage' ? 'e.g. 20' : 'e.g. 15'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Expiry Date <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Rule Active</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-gray-350" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Rule'}
            </button>
          </form>
        </div>

        {/* Discounts List */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Active Promotion Rules
            </h2>
            <button
              onClick={fetchData}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Rule Name</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Value</th>
                    <th className="pb-3 pr-4">Expiry</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {discounts.map((disc) => {
                    const cat = categories.find((c) => c.slug === disc.categorySlug);
                    return (
                      <tr key={disc.id} className="text-sm">
                        <td className="py-4 font-semibold text-gray-800 dark:text-white flex items-center gap-1.5 capitalize">
                          <Tag size={14} className="text-blue-500" />
                          {disc.name}
                        </td>
                        <td className="py-4 capitalize text-gray-600 dark:text-gray-300">
                          {cat ? `${cat.emoji} ${cat.name}` : disc.categorySlug}
                        </td>
                        <td className="py-4 font-bold text-blue-600 dark:text-blue-400">
                          {disc.type === 'percentage' ? `${disc.value}% OFF` : `$${disc.value} OFF`}
                        </td>
                        <td className="py-4 text-gray-500 dark:text-gray-400">
                          {disc.expiresAt ? (
                            <span className="flex items-center gap-1">
                              <Calendar size={13} />
                              {new Date(disc.expiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-350">No Expiry</span>
                          )}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleActive(disc.id, disc.isActive)}
                            className="transition-colors"
                          >
                            {disc.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-lg">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                                Paused
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDelete(disc.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Rule"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {discounts.length === 0 && (
                <div className="text-center py-12 text-gray-400">No discount rules configured yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
