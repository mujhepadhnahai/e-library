import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, ChatMessage, Order } from '../types';

interface Store {
  products: Product[];
  cart: CartItem[];
  chatMessages: ChatMessage[];
  orders: Order[];
  darkMode: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addChatMessage: (message: ChatMessage) => void;
  addOrder: (order: Order) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      products: [
        {
          id: '1',
          name: 'Clean Code',
          description: 'A handbook of agile software craftsmanship',
          price: 39.99,
          image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
          category: 'Programming'
        },
        {
          id: '2',
          name: 'Design Patterns',
          description: 'Elements of Reusable Object-Oriented Software',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
          category: 'Programming'
        },
        {
          id: '3',
          name: 'The Pragmatic Programmer',
          description: 'Your journey to mastery',
          price: 44.99,
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
          category: 'Programming'
        }
      ],
      cart: [],
      chatMessages: [],
      orders: [],
      darkMode: false,
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: (state.products.length + 1).toString()
            }
          ]
        })),
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })),
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
          cart: [], // Clear cart after order
        })),
      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),
    }),
    {
      name: 'e-library-storage',
    }
  )
);