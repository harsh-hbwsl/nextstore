'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CreditCard, DollarSign, Smartphone, ShoppingBag, ShieldCheck } from 'lucide-react';
import PaymentForm from './PaymentForm';
import { CustomerInfo, PaymentMethod, PaymentDetails } from '@/types';

export default function CheckoutClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  
  // Card details from PaymentForm
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');

  // UPI details
  const [upiId, setUpiId] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // Redirect if cart is empty
  useEffect(() => {
    if (status !== 'loading' && cartItems.length === 0) {
      router.push('/products');
    }
  }, [cartItems, status, router]);

  // Pre-fill user data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!phone.trim() || phone.length < 10) newErrors.phone = 'Valid phone is required';
    if (!address.trim()) newErrors.address = 'Delivery address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!pincode.trim() || pincode.length < 5) newErrors.pincode = 'Valid pincode is required';

    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        newErrors.upiId = 'Enter a valid UPI ID (e.g. name@okhdfcbank)';
      }
    } else if (paymentMethod === 'card') {
      if (!cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
      if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!expiryMonth || !expiryYear) {
        newErrors.expiry = 'Select card expiry date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    let paymentDetails: PaymentDetails = { type: 'cod' };

    if (paymentMethod === 'upi') {
      paymentDetails = { type: 'upi', upiId: upiId.trim() };
    } else if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      paymentDetails = {
        type: 'card',
        cardHolderName: cardHolder.trim(),
        lastFourDigits: cleanCard.slice(-4),
        expiryMonth,
        expiryYear,
      };
    }

    const customerInfo: CustomerInfo = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    };

    const orderPayload = {
      userId: session?.user?.id,
      customerInfo,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price, // Already has discount applied if any
        discountedPrice: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      paymentMethod,
      paymentDetails,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Order created! Clear local cart and redirect
      clearCart();
      router.push(`/checkout/success?orderId=${data.id}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ── Checkout Form ── */}
      <div className="lg:col-span-8 space-y-6">
        {serverError && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* Step 1: Shipping Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, unit, block..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Pincode / Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Payment Details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              Payment Details
            </h2>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 'cod', label: 'COD', icon: DollarSign },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'upi', label: 'UPI', icon: Smartphone },
              ].map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border text-sm font-semibold transition-all ${
                      active
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-gray-250 dark:border-gray-700 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={20} className="mb-1.5" />
                    {method.label}
                  </button>
                );
              })}
            </div>

            {/* COD View */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-350">
                💵 <strong>Cash on Delivery:</strong> Pay in cash when your order is delivered to your doorstep. No prepayment required!
              </div>
            )}

            {/* UPI View */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300">
                  UPI ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="username@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.upiId && <p className="text-red-500 text-xs">{errors.upiId}</p>}
                <p className="text-xs text-gray-400">Scan QR or enter UPI ID at delivery to pay securely.</p>
              </div>
            )}

            {/* Credit/Debit Card View */}
            {paymentMethod === 'card' && (
              <PaymentForm
                cardHolder={cardHolder}
                setCardHolder={setCardHolder}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                expiryMonth={expiryMonth}
                setExpiryMonth={setExpiryMonth}
                expiryYear={expiryYear}
                setExpiryYear={setExpiryYear}
                errors={errors}
              />
            )}
          </div>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck size={16} className="text-green-500" />
            <span>256-bit SSL Secure and Encrypted Payment Checkout</span>
          </div>

          {/* Checkout Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Secure Order...
              </span>
            ) : (
              `Place Secure Order — $${cartTotal.toFixed(2)}`
            )}
          </button>
        </form>
      </div>

      {/* ── Order Summary Sidebar ── */}
      <div className="lg:col-span-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <ShoppingBag size={18} className="text-blue-500" />
            Order Summary
          </h2>

          <div className="max-h-72 overflow-y-auto space-y-4 pr-1 mb-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-3 items-center">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-12 h-12 object-contain bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-550">
              <span>Shipping</span>
              <span className="text-green-500 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-800 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
              <span>Total Amount</span>
              <span className="text-blue-600 dark:text-blue-400">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
