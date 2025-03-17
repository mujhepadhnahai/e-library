import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';
import axios from 'axios';

export function Chatbot() {
  const [input, setInput] = useState('');
  const { chatMessages, addChatMessage, darkMode } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', { message: input });
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        text: response.data.message,
        isBot: true,
        timestamp: new Date(),
      });
    } catch (error) {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request at the moment.",
        isBot: true,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isBot
                  ? darkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800 shadow'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`max-w-[80%] rounded-lg p-3 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow'
            }`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t border-gray-200`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}