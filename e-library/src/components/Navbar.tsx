import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Store, Settings, Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Navbar() {
  const cart = useStore((state) => state.cart);
  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Store className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                E-Library
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 hover:bg-opacity-20 hover:bg-gray-100 rounded-full ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <Link to="/admin" className={`p-2 hover:bg-opacity-20 hover:bg-gray-100 rounded-full ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Settings className="h-6 w-6" />
            </Link>
            <Link to="/chat" className={`p-2 hover:bg-opacity-20 hover:bg-gray-100 rounded-full ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <MessageSquare className="h-6 w-6" />
            </Link>
            <Link to="/cart" className={`p-2 hover:bg-opacity-20 hover:bg-gray-100 rounded-full relative ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}