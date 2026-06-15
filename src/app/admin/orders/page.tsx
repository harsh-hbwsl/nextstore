'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Mail, Phone, Calendar, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
    } catch {
      console.error('Could not load customer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'cancelled':
        return 'text-red-655 bg-red-50 dark:bg-red-950/20';
      case 'pending':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
          Customer Orders
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track purchases, verify details, and audit completed checkout transactions.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Order Auditing Pipeline
          </h2>
          <button
            onClick={fetchOrders}
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
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer Name</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Items Count</th>
                  <th className="pb-3 pr-4">Total Amount</th>
                  <th className="pb-3 pr-4">Payment Method</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {orders.map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="py-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      #{order.id}
                    </td>
                    <td className="py-4 font-semibold text-gray-800 dark:text-white">
                      {order.customerInfo.name}
                    </td>
                    <td className="py-4 text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                      <Calendar size={13} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-655 dark:text-gray-300">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="py-4 font-extrabold text-gray-800 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-2 py-0.5 rounded-lg uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                        title="Audit Order"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-400">No customer checkout transactions found.</div>
            )}
          </div>
        )}
      </div>

      {/* Audit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Order Details
                </h3>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1">
                  #{selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-250 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-gray-800 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Customer Info
                  </h4>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {selectedOrder.customerInfo.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                    <Mail size={12} />
                    {selectedOrder.customerInfo.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                    <Phone size={12} />
                    {selectedOrder.customerInfo.phone}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Shipping Address
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {selectedOrder.customerInfo.address}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    {selectedOrder.customerInfo.city} — {selectedOrder.customerInfo.pincode}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Items Ordered
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-contain bg-white rounded-lg border border-gray-100 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          ${(item.discountedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Detail Details */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Payment Verification
                </h4>
                <div className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 p-3 rounded-xl text-xs">
                  <strong>Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}
                  {selectedOrder.paymentMethod === 'card' && (
                    <span>
                      {' '}
                      — Cardholder: {(selectedOrder.paymentDetails as { cardHolderName: string }).cardHolderName} (ending in {(selectedOrder.paymentDetails as { lastFourDigits: string }).lastFourDigits})
                    </span>
                  )}
                  {selectedOrder.paymentMethod === 'upi' && (
                    <span> — VPA ID: {(selectedOrder.paymentDetails as { upiId: string }).upiId}</span>
                  )}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discounted Amount</span>
                    <span>-${selectedOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-base text-gray-800 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2.5">
                  <span>Total Amount Paid</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
