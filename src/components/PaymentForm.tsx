'use client';

import { useState } from 'react';

interface PaymentFormProps {
  cardHolder: string;
  setCardHolder: (v: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  expiryMonth: string;
  setExpiryMonth: (v: string) => void;
  expiryYear: string;
  setExpiryYear: (v: string) => void;
  errors: Record<string, string>;
}

export default function PaymentForm({
  cardHolder,
  setCardHolder,
  cardNumber,
  setCardNumber,
  expiryMonth,
  setExpiryMonth,
  expiryYear,
  setExpiryYear,
  errors,
}: PaymentFormProps) {
  const [cvv, setCvv] = useState('');

  // Formats card number: 1234123412341234 -> 1234 1234 1234 1234
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Digits only
    const trimmed = value.slice(0, 16);
    const matches = trimmed.match(/.{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setCardNumber(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.slice(0, 3));
  };

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

  return (
    <div className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
      <div>
        <label className="block text-sm font-semibold text-gray-655 dark:text-gray-300 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. John Doe"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-655 dark:text-gray-300 mb-1">
          Card Number
        </label>
        <input
          type="text"
          required
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-655 dark:text-gray-300 mb-1">
            Expiry Date
          </label>
          <div className="flex gap-2">
            <select
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">MM</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">YY</option>
              {years.map((y) => (
                <option key={y} value={y.slice(-2)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-655 dark:text-gray-300 mb-1">
            CVV
          </label>
          <input
            type="password"
            required
            placeholder="•••"
            value={cvv}
            onChange={handleCvvChange}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
