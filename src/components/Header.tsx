'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Menu,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } =
    useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCheckoutClick = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            NextStore
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-455 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-455 transition-colors font-medium"
            >
              Products
            </Link>
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-455 transition-colors font-medium flex items-center gap-1"
              >
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}
          </nav>

          {/* Action Row: ThemeToggle + Cart + Auth + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              aria-label={`Open cart (${cartCount} items)`}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Auth section */}
            <div className="hidden md:flex items-center gap-3 border-l border-gray-100 dark:border-gray-800 pl-4">
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                      {session.user.name}
                    </p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-2 bg-white dark:bg-gray-950">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
              {session ? (
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{session.user.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    href="/login"
                    className="block text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* ── Cart Drawer ─────────────────────────────────────── */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/45 z-45 transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Cart{' '}
                <span className="text-gray-400 dark:text-gray-500 font-normal text-base">
                  ({cartCount})
                </span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-900">
                <ShoppingCart size={48} className="text-gray-200 dark:text-gray-800 mb-4" />
                <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Your cart is empty
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                  Add some products to get started!
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 items-start bg-gray-50 dark:bg-gray-800 rounded-xl p-3 border border-transparent dark:border-gray-700/50"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 object-contain bg-white dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-650 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">
                          {item.product.title}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-300 transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center text-gray-850 dark:text-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-300 transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto w-6 h-6 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 text-red-400 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Total</span>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-bold text-center block shadow-lg hover:shadow-xl transition-all"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
