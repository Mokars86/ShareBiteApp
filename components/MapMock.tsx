import React from 'react';
import { MapPin } from 'lucide-react';
import { FoodItem } from '../types';

interface MapMockProps {
  items: FoodItem[];
  onItemSelect: (item: FoodItem) => void;
}

export const MapMock: React.FC<MapMockProps> = ({ items, onItemSelect }) => {
  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden rounded-xl">
      {/* Fake Map Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Fake Map Streets */}
      <div className="absolute top-1/4 left-0 w-full h-4 bg-white/50 transform -rotate-6"></div>
      <div className="absolute top-0 left-1/3 h-full w-4 bg-white/50 transform rotate-12"></div>
      <div className="absolute bottom-1/4 right-0 w-2/3 h-4 bg-white/50 transform rotate-3"></div>

      {/* User Location Pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
            You
        </div>
      </div>

      {/* Pins */}
      {items.map((item, idx) => {
        // Random placement generator based on ID hash for consistent demo position
        const hash = item.id.charCodeAt(0) + item.id.charCodeAt(1); 
        const top = 20 + (hash % 60); // 20% to 80%
        const left = 20 + ((hash * 2) % 60); // 20% to 80%

        return (
            <button
                key={item.id}
                onClick={() => onItemSelect(item)}
                className="absolute transform -translate-x-1/2 -translate-y-full hover:scale-110 transition duration-200 group"
                style={{ top: `${top}%`, left: `${left}%` }}
            >
                <div className={`relative p-1 rounded-full border-2 shadow-lg bg-white ${item.aiVerified ? 'border-eco-500' : 'border-warm-500'}`}>
                    <img src={item.imageUrl} className="w-8 h-8 rounded-full object-cover" alt="pin" />
                    {item.aiVerified && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-eco-500 rounded-full border border-white"></div>
                    )}
                </div>
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white text-xs px-2 py-1 rounded shadow text-nowrap z-20 font-medium">
                    {item.title}
                </div>
            </button>
        );
      })}

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded-lg text-xs text-gray-500 shadow-sm">
        Map View (Demo)
      </div>
    </div>
  );
};
