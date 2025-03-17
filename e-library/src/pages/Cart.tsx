import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function Cart() {
  const { cart, removeFromCart, updateQuantity, darkMode, addOrder } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (isProcessing || cart.length === 0) return;
    setIsProcessing(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Create order record
      const order: Order = {
        id: Date.now().toString(),
        items: cart,
        total,
        date: new Date(),
        status: 'pending',
      };
      addOrder(order);

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Your cart is empty</p>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className={`flex items-center space-x-4 p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white shadow'
                }`}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                    className={`p-1 rounded ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className={`p-1 rounded ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className={`p-2 text-red-600 rounded ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || cart.length === 0}
              className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>{isProcessing ? 'Processing...' : 'Proceed to Checkout'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}