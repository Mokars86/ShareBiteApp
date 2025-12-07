export enum UserRole {
  DONOR = 'DONOR',
  RECIPIENT = 'RECIPIENT',
  BOTH = 'BOTH'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  rating: number;
  badges: string[];
  stats: {
    mealsSaved: number;
    co2Reduced: number; // in kg
    mealsReceived: number;
    moneySaved: number;
  };
}

export interface FoodItem {
  id: string;
  donorId: string;
  donorName: string;
  donorAvatar: string;
  donorRating: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: string;
  category: string;
  isHalal: boolean;
  isVeg: boolean;
  preparedTime: string; // ISO string
  expiryTime: number; // Timestamp
  pickupLocation: string;
  distance: number; // approximated for demo (km)
  status: 'AVAILABLE' | 'CLAIMED' | 'PICKED_UP';
  tags: string[];
  aiVerified: boolean; // If Gemini verified freshness
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface ChatSession {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  otherUserId: string; 
  otherUserName: string;
  otherUserAvatar: string;
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
}