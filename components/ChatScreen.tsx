import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Image as ImageIcon, MapPin, MoreVertical } from 'lucide-react';
import { ChatSession, ChatMessage, User } from '../types';

interface ChatScreenProps {
  session: ChatSession;
  currentUser: User;
  onSendMessage: (sessionId: string, text: string) => void;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ session, currentUser, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(session.id, inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const quickReplies = [
    "Hi! Is this still available?",
    "I can pick it up in 30 mins.",
    "I'm on my way!",
    "I have arrived.",
    "Thank you so much!"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 animate-fade-in transition-colors duration-300">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-900 px-4 py-3 shadow-sm border-b dark:border-gray-800 flex items-center gap-3 z-10 transition-colors duration-300">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-white" />
        </button>
        
        <div className="relative">
          <img src={session.otherUserAvatar} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" alt="User" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{session.otherUserName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
            Re: {session.itemTitle}
          </p>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Item Context Card at top of chat */}
        <div className="flex gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 mb-6 mx-4">
            <img src={session.itemImage} className="w-12 h-12 rounded-md object-cover" alt="Item" />
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Requesting</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">{session.itemTitle}</p>
            </div>
        </div>

        {session.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm relative
                  ${isMe 
                    ? 'bg-eco-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                  }`}
              >
                {msg.text}
                <span className={`text-[10px] absolute bottom-1 right-2 opacity-70 ${isMe ? 'text-eco-100' : 'text-gray-400 dark:text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="bg-gray-50 dark:bg-gray-950 px-4 py-2 overflow-x-auto no-scrollbar flex gap-2 border-t border-gray-100 dark:border-gray-800">
        {quickReplies.map((reply, idx) => (
            <button 
                key={idx}
                onClick={() => {
                    onSendMessage(session.id, reply);
                }}
                className="whitespace-nowrap bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-2 rounded-full shadow-sm hover:bg-eco-50 dark:hover:bg-eco-900/20 hover:border-eco-200 dark:hover:border-eco-800 hover:text-eco-700 dark:hover:text-eco-400 transition"
            >
                {reply}
            </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 p-3 border-t dark:border-gray-800 flex items-center gap-2 pb-6 sm:pb-3 transition-colors duration-300">
        <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
             <MapPin className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
             <ImageIcon className="w-5 h-5" />
        </button>
        
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center transition-colors">
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..." 
                className="bg-transparent w-full outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400"
            />
        </div>

        <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-3 rounded-full shadow-lg transition ${inputText.trim() ? 'bg-eco-600 text-white hover:bg-eco-700' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};