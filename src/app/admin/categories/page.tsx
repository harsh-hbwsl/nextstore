'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🏷️');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
    } catch {
      setError('Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          emoji: emoji.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create category.');
      }

      setSuccess('Category created successfully!');
      setName('');
      setDescription('');
      setEmoji('🏷️');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All products linked to it will remain, but the category slug will be unlinked.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category.');
      }

      setSuccess('Category deleted successfully.');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
          Category Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Create, edit, and delete storefront categories dynamically.
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
        {/* Create Category Form */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-1.5">
            <Plus size={18} className="text-blue-500" />
            Add New Category
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Category Emoji
              </label>
              <input
                type="text"
                required
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="e.g. 💻, 👗, 🍔"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Home decor"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the category..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Category Rules
            </h2>
            <button
              onClick={fetchCategories}
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
                    <th className="pb-3 pr-4">Emoji</th>
                    <th className="pb-3 pr-4">Category Name</th>
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="text-sm">
                      <td className="py-4 text-2xl">{cat.emoji}</td>
                      <td className="py-4 font-semibold text-gray-800 dark:text-white capitalize">
                        {cat.name}
                      </td>
                      <td className="py-4 text-gray-500 dark:text-gray-400">
                        {cat.description || 'No description provided.'}
                      </td>
                      <td className="py-4">
                        {cat.isDefault ? (
                          <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-350 text-xs font-semibold px-2 py-0.5 rounded-lg">
                            System
                          </span>
                        ) : (
                          <span className="inline-block bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-lg">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={cat.isDefault}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title={cat.isDefault ? 'System categories cannot be deleted' : 'Delete Category'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-400">No categories found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
