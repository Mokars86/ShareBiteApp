import { FoodItem, User, UserRole } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  avatar: 'https://picsum.photos/100/100',
  role: UserRole.BOTH,
  rating: 4.8,
  badges: ['Eco Hero', 'Top Donor', 'Verified Neighbor'],
  stats: {
    mealsSaved: 12,
    co2Reduced: 5.4,
    mealsReceived: 8,
    moneySaved: 52.50
  }
};

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    donorId: 'd1',
    donorName: 'Sarah M.',
    donorAvatar: 'https://picsum.photos/101/101',
    donorRating: 4.9,
    title: 'Homemade Vegetable Lasagna',
    description: 'Made too much for dinner. Fresh and still warm! Contains cheese and spinach.',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    quantity: '2 Servings',
    category: 'Pasta',
    isHalal: true,
    isVeg: true,
    preparedTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    expiryTime: Date.now() + 1000 * 60 * 60 * 12, // 12 hours left
    pickupLocation: 'Downtown Apt 4B',
    distance: 0.5,
    status: 'AVAILABLE',
    tags: ['Homemade', 'Vegetarian', 'Hot'],
    aiVerified: true
  },
  {
    id: 'f2',
    donorId: 'd2',
    donorName: 'Bakery Delight',
    donorAvatar: 'https://picsum.photos/102/102',
    donorRating: 4.5,
    title: 'Assorted Bagels & Pastries',
    description: 'End of day leftover bagels. Perfectly safe to eat, just not sold today.',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    quantity: 'Box of 6',
    category: 'Bakery',
    isHalal: true,
    isVeg: true,
    preparedTime: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    expiryTime: Date.now() + 1000 * 60 * 60 * 24, 
    pickupLocation: 'Main St Bakery',
    distance: 1.2,
    status: 'AVAILABLE',
    tags: ['Bakery', 'Sweet', 'Grab & Go'],
    aiVerified: false
  },
  {
    id: 'f3',
    donorId: 'd3',
    donorName: 'Mike T.',
    donorAvatar: 'https://picsum.photos/103/103',
    donorRating: 4.2,
    title: 'Unopened Canned Soup',
    description: 'Cleaning out pantry. Moving out soon. Tomato and Chicken Noodle.',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    quantity: '3 Cans',
    category: 'Pantry',
    isHalal: false,
    isVeg: false,
    preparedTime: new Date().toISOString(),
    expiryTime: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
    pickupLocation: 'Westside Dorms',
    distance: 2.5,
    status: 'AVAILABLE',
    tags: ['Sealed', 'Long-life'],
    aiVerified: true
  }
];