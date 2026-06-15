'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Menu,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } =
    useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-extrabold text-blue-600">
            NextStore
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Admin
            </Link>
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label={`Open cart (${cartCount} items)`}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 px-4 py-3 space-y-1 bg-white">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              { href: '/admin', label: 'Admin' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* ── Cart Drawer ─────────────────────────────────────── */}
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                Cart{' '}
                <span className="text-gray-400 font-normal text-base">
                  ({cartCount})
                </span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <ShoppingCart size={48} className="text-gray-200 mb-4" />
                <p className="font-semibold text-gray-700 mb-1">
                  Your cart is empty
                </p>
                <p className="text-gray-400 text-sm mb-6">
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 items-start bg-gray-50 rounded-xl p-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 object-contain bg-white rounded-lg border border-gray-100 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                          {item.product.title}
                        </p>
                        <p className="text-blue-600 font-bold text-sm">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto w-6 h-6 rounded-md hover:bg-red-50 text-red-400 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="text-xl font-extrabold text-blue-600">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-bold">
                    Checkout
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
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
