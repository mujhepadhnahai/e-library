import stripe from '../lib/stripe';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../../types';

export async function createCheckoutSession(items: CartItem[]) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: [item.product.image],
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/cart`,
    });

    // Store order in Supabase
    await supabase.from('orders').insert({
      session_id: session.id,
      items: items,
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'pending'
    });

    return session;
  } catch (error) {
    console.error('Payment API Error:', error);
    throw new Error('Failed to create checkout session');
  }
}