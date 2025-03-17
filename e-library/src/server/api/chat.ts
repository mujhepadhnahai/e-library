import { OpenAI } from 'openai';
import { supabase } from '../lib/supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function handleChatRequest(message: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for an e-library website, knowledgeable about books and helping customers find what they need."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    // Store chat history in Supabase
    await supabase.from('chat_history').insert({
      user_message: message,
      assistant_message: completion.choices[0].message.content,
      timestamp: new Date()
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw new Error('Failed to process chat request');
  }
}