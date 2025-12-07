import React, { useState, useMemo, useEffect } from 'react';
import { 
  Map as MapIcon, 
  List, 
  Plus, 
  MessageCircle, 
  User as UserIcon, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  Leaf, 
  Award,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  Cloud,
  Settings,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Bell
} from 'lucide-react';

import { MOCK_FOOD_ITEMS, CURRENT_USER } from './constants';
import { FoodItem, User, ChatSession, UserRole, ChatMessage } from './types';
import { PostFoodFlow } from './components/PostFoodFlow';
import { MapMock } from './components/MapMock';
import { ChatScreen } from './components/ChatScreen';

// --- Sub-Components ---

const SplashScreen: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-eco-600 text-white animate-fade-in relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
       
       <div className="relative z-10 flex flex-col items-center">
         <div className="bg-white p-4 rounded-full shadow-xl mb-6 animate-bounce">
            <Leaf className="w-12 h-12 text-eco-600" />
         </div>
         <h1 className="text-4xl font-extrabold tracking-tight mb-2">ShareBite</h1>
         <p className="text-eco-100 font-medium tracking-wide text-sm">Waste Less. Share More.</p>
       </div>
       
       <div className="absolute bottom-10">
         <div className="w-8 h-8 border-4 border-eco-200 border-t-white rounded-full animate-spin"></div>
       </div>
    </div>
  );
};

const FoodCard: React.FC<{ item: FoodItem, onClick: () => void }> = ({ item, onClick }) => {
  const timeLeft = Math.max(0, Math.round((item.expiryTime - Date.now()) / (1000 * 60 * 60)));
  
  return (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-4 cursor-pointer active:scale-[0.99] transition">
      <div className="relative h-40 w-full">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 flex gap-1">
          {item.aiVerified && (
            <span className="bg-eco-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-3 h-3" /> AI Verified
            </span>
          )}
          {item.tags.includes('Vegetarian') && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full shadow-sm">Veg</span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">
            {item.distance} km away
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 mt-1 mb-2">
            <img src={item.donorAvatar} className="w-5 h-5 rounded-full" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{item.donorName} • ⭐ {item.donorRating}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-2 mt-1">
          <span className="flex items-center gap-1 text-warm-600 font-medium">
             <Clock className="w-3 h-3" /> Ends in {timeLeft}h
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">{item.quantity}</span>
        </div>
      </div>
    </div>
  );
};

const Onboarding: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [slide, setSlide] = useState(0);
  
  const slides = [
    {
      title: "Reduce Food Waste",
      text: "Share extra meals instead of throwing them away. Save the planet, one plate at a time.",
      icon: <Leaf className="w-24 h-24 text-eco-500" />
    },
    {
      title: "Help Your Community",
      text: "Support people in need with your leftovers. Connect with neighbors instantly.",
      icon: <UserIcon className="w-24 h-24 text-blue-500" />
    },
    {
      title: "Safe & Verified",
      text: "Our AI checks food freshness, and community ratings keep everyone safe.",
      icon: <ShieldCheck className="w-24 h-24 text-warm-500" />
    }
  ];

  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-900 text-center animate-fade-in transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-8 animate-bounce">{slides[slide].icon}</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{slides[slide].title}</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs">{slides[slide].text}</p>
      </div>
      <div className="w-full">
        <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${slide === i ? 'w-8 bg-eco-600' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
            ))}
        </div>
        <button 
          onClick={() => {
            if (slide < 2) setSlide(slide + 1);
            else onFinish();
          }}
          className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl"
        >
          {slide === 2 ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
};

const AuthScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    return (
        <div className="h-full bg-white dark:bg-gray-900 p-8 flex flex-col justify-center animate-fade-in transition-colors duration-300">
            <div className="mb-10">
                <div className="inline-block p-3 rounded-2xl bg-eco-50 dark:bg-gray-800 mb-4">
                  <Leaf className="w-8 h-8 text-eco-600" />
                </div>
                <h1 className="text-3xl font-bold text-eco-700 dark:text-eco-500 mb-2">ShareBite</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back! Let's save some food.</p>
            </div>

            <div className="space-y-4">
                <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-eco-500" />
                <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-eco-500" />
                <button onClick={onLogin} className="w-full bg-eco-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-eco-700 transition">
                    Log In
                </button>
            </div>
            
            <div className="mt-8 text-center text-gray-400 text-sm">
                <p>Don't have an account? <span className="text-eco-600 font-bold cursor-pointer">Sign Up</span></p>
            </div>
        </div>
    )
}

const DetailView: React.FC<{ item: FoodItem, onBack: () => void, onClaim: () => void }> = ({ item, onBack, onClaim }) => {
    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900 pb-20 overflow-y-auto animate-fade-in transition-colors duration-300">
            <div className="relative h-72 w-full">
                <img src={item.imageUrl} className="w-full h-full object-cover" />
                <button onClick={onBack} className="absolute top-4 left-4 bg-white/50 dark:bg-black/50 backdrop-blur p-2 rounded-full hover:bg-white dark:hover:bg-black transition">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <div className="absolute top-4 right-4 flex gap-2">
                    {item.aiVerified && (
                         <div className="bg-eco-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                             <ShieldCheck className="w-3 h-3" /> AI Verified
                         </div>
                    )}
                </div>
            </div>
            
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
                    <span className="bg-green-50 dark:bg-green-900/30 text-eco-700 dark:text-eco-400 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">{item.status}</span>
                </div>

                <div className="flex items-center gap-3 my-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <img src={item.donorAvatar} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <p className="font-bold text-sm dark:text-white">{item.donorName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Eco Hero • {item.donorRating} ⭐</p>
                    </div>
                    <button className="bg-white dark:bg-gray-700 p-2 rounded-full border dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Description</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {item.tags.map(t => (
                            <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs">{t}</span>
                        ))}
                    </div>

                    <div className="border-t dark:border-gray-800 pt-4 grid grid-cols-2 gap-4">
                         <div>
                             <p className="text-xs text-gray-400">Pick up by</p>
                             <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {new Date(item.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </p>
                         </div>
                         <div>
                             <p className="text-xs text-gray-400">Distance</p>
                             <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.distance} km away</p>
                         </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
                 <button onClick={onClaim} className="w-full bg-eco-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-eco-700 flex items-center justify-center gap-2">
                     Request Food <ArrowRight className="w-5 h-5" />
                 </button>
            </div>
        </div>
    )
}

const SettingsScreen: React.FC<{
    onBack: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
}> = ({ onBack, darkMode, toggleDarkMode, onLogout }) => {
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            onLogout();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950 animate-fade-in transition-colors duration-300">
             <div className="bg-white dark:bg-gray-900 p-4 shadow-sm flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white"/>
                </button>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Settings</h2>
            </div>
            
            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Appearance</p>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="p-4 flex justify-between items-center cursor-pointer" onClick={toggleDarkMode}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {darkMode ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                            </div>
                            <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-eco-600' : 'bg-gray-200'}`}>
                                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${darkMode ? 'translate-x-5' : ''}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Account</p>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 divide-y dark:divide-gray-800">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Language</span>
                            </div>
                            <span className="text-sm text-gray-400 flex items-center gap-1">English <ChevronRight className="w-4 h-4" /></span>
                        </button>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Support</p>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Help & Safety</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full p-4 mt-4 text-red-500 font-bold bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2"
                >
                    <LogOut className="w-5 h-5" /> Log Out
                </button>

                <p className="text-center text-xs text-gray-400 pt-4">Version 1.0.0</p>
            </div>
        </div>
    );
};

const ProfileScreen: React.FC<{ user: User, onOpenSettings: () => void }> = ({ user, onOpenSettings }) => {
    // Initial view depends on user role
    const [viewMode, setViewMode] = useState<'DONOR' | 'RECIPIENT'>(
        user.role === UserRole.RECIPIENT ? 'RECIPIENT' : 'DONOR'
    );

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col animate-fade-in transition-colors duration-300">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 p-6 pb-4 rounded-b-3xl shadow-sm z-10 transition-colors duration-300">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-eco-50 dark:border-gray-800 mb-3 relative shadow-md">
                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                        <div className="absolute bottom-0 right-0 bg-eco-600 text-white text-xs px-2 py-0.5 rounded-full border border-white dark:border-gray-900">
                            {user.rating} ★
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.role === 'BOTH' ? 'Donor & Recipient' : user.role}</p>

                    {/* Role Switcher */}
                    {user.role === 'BOTH' && (
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-64 relative">
                             <button 
                                onClick={() => setViewMode('DONOR')}
                                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${viewMode === 'DONOR' ? 'bg-white dark:bg-gray-700 shadow-md text-eco-700 dark:text-eco-400' : 'text-gray-500 dark:text-gray-400'}`}
                             >
                                Donor
                             </button>
                             <button 
                                onClick={() => setViewMode('RECIPIENT')}
                                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-300 z-10 ${viewMode === 'RECIPIENT' ? 'bg-white dark:bg-gray-700 shadow-md text-warm-600 dark:text-warm-400' : 'text-gray-500 dark:text-gray-400'}`}
                             >
                                Recipient
                             </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
                
                {viewMode === 'DONOR' ? (
                    <div className="space-y-6 animate-fade-in">
                        {/* Donor Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-eco-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                                <Leaf className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 group-hover:scale-110 transition" />
                                <div className="text-3xl font-bold mb-1">{user.stats.mealsSaved}</div>
                                <div className="text-eco-100 text-sm font-medium">Meals Saved</div>
                            </div>
                            <div className="bg-teal-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                                <Cloud className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 group-hover:scale-110 transition" />
                                <div className="text-3xl font-bold mb-1">{user.stats.co2Reduced}<span className="text-lg">kg</span></div>
                                <div className="text-teal-100 text-sm font-medium">CO₂ Reduced</div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-800 dark:text-white">Your Badges</h3>
                                <span className="text-xs text-eco-600 dark:text-eco-400 font-semibold cursor-pointer">View All</span>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                    {user.badges.map((badge, i) => (
                                        <div key={i} className="flex flex-col items-center min-w-[80px]">
                                            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-full mb-2">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs text-center font-medium text-gray-600 dark:text-gray-400 leading-tight">{badge}</span>
                                        </div>
                                    ))}
                                    <div className="flex flex-col items-center min-w-[80px] opacity-50 grayscale">
                                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-400 p-3 rounded-full mb-2">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs text-center font-medium text-gray-400 leading-tight">Super Star</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Impact Summary */}
                        <div className="bg-gradient-to-br from-eco-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 rounded-2xl border border-eco-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Community Impact</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">You've helped 8 neighbors this month! Keep up the great work.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Recipient Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-warm-500 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                                <ShoppingBag className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 group-hover:scale-110 transition" />
                                <div className="text-3xl font-bold mb-1">{user.stats.mealsReceived}</div>
                                <div className="text-warm-100 text-sm font-medium">Meals Received</div>
                            </div>
                            <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                                <DollarSign className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 group-hover:scale-110 transition" />
                                <div className="text-3xl font-bold mb-1">${user.stats.moneySaved}</div>
                                <div className="text-purple-100 text-sm font-medium">Money Saved</div>
                            </div>
                        </div>

                        {/* Recent Pickups Mock */}
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Recent Pickups</h3>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y dark:divide-gray-800">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="p-4 flex items-center gap-3">
                                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                                            <Leaf className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">Bagels & Pastries</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">From Bakery Delight • 2 days ago</p>
                                        </div>
                                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">Completed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="pt-4 space-y-3">
                     <button 
                        onClick={onOpenSettings}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-[0.99]"
                     >
                        <span className="font-medium">Account Settings</span>
                        <Settings className="w-5 h-5 text-gray-400" />
                     </button>
                </div>

            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  // Global State
  const [view, setView] = useState<'SPLASH' | 'ONBOARDING' | 'AUTH' | 'APP'>('SPLASH');
  const [activeTab, setActiveTab] = useState<'HOME' | 'POST' | 'CHAT' | 'PROFILE'>('HOME');
  const [homeMode, setHomeMode] = useState<'LIST' | 'MAP'>('LIST');
  
  // Data State
  const [items, setItems] = useState<FoodItem[]>(MOCK_FOOD_ITEMS);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [filterType, setFilterType] = useState('All');

  // Chat State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // App Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Splash Screen Logic
  useEffect(() => {
    if (view === 'SPLASH') {
      const timer = setTimeout(() => {
        // In a real app, check for auth token here
        setView('ONBOARDING');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Dark Mode Logic
  useEffect(() => {
      if (darkMode) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [darkMode]);

  const handlePostSuccess = (newItem: FoodItem) => {
    setItems(prev => [newItem, ...prev]);
    setIsPosting(false);
    setActiveTab('HOME');
    setHomeMode('LIST');
  };

  const handleLogout = () => {
    // Reset states to default
    setActiveTab('HOME');
    setHomeMode('LIST');
    setChatSessions([]);
    setActiveChatId(null);
    setIsSettingsOpen(false);
    setView('AUTH');
  };

  const handleClaim = (item: FoodItem) => {
      // Check if chat exists
      let session = chatSessions.find(s => s.itemId === item.id);
      
      if (!session) {
          session = {
              id: Date.now().toString(),
              itemId: item.id,
              itemTitle: item.title,
              itemImage: item.imageUrl,
              otherUserId: item.donorId,
              otherUserName: item.donorName,
              otherUserAvatar: item.donorAvatar,
              messages: [],
              lastMessage: "Request sent",
              lastMessageTime: Date.now(),
              unreadCount: 0
          };
          setChatSessions(prev => [session!, ...prev]);
      }

      setActiveChatId(session.id);
      setSelectedItem(null);
      setActiveTab('CHAT');
  };

  const handleSendMessage = (sessionId: string, text: string) => {
      setChatSessions(prev => prev.map(session => {
          if (session.id === sessionId) {
              const newMessage: ChatMessage = {
                  id: Date.now().toString(),
                  senderId: CURRENT_USER.id,
                  text: text,
                  timestamp: Date.now()
              };
              return {
                  ...session,
                  messages: [...session.messages, newMessage],
                  lastMessage: text,
                  lastMessageTime: Date.now()
              };
          }
          return session;
      }));
  };

  const filteredItems = useMemo(() => {
      if (filterType === 'All') return items;
      return items.filter(i => i.category === filterType || i.tags.includes(filterType));
  }, [items, filterType]);

  // --- Render Functions ---

  if (view === 'SPLASH') {
      return <SplashScreen />;
  }

  if (view === 'ONBOARDING') {
      return <Onboarding onFinish={() => setView('AUTH')} />;
  }

  if (view === 'AUTH') {
      return <AuthScreen onLogin={() => setView('APP')} />;
  }

  // If we are posting food, show the full screen modal flow
  if (isPosting) {
      return (
          <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-colors duration-300">
              <PostFoodFlow 
                currentUser={CURRENT_USER} 
                onCancel={() => setIsPosting(false)} 
                onPostSuccess={handlePostSuccess} 
              />
          </div>
      );
  }

  // If item detail is selected
  if (selectedItem) {
      return (
          <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-colors duration-300">
             <DetailView 
                item={selectedItem} 
                onBack={() => setSelectedItem(null)} 
                onClaim={() => handleClaim(selectedItem)}
             />
          </div>
      );
  }

  // If settings are open
  if (isSettingsOpen) {
      return (
          <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-colors duration-300">
              <SettingsScreen 
                  onBack={() => setIsSettingsOpen(false)}
                  darkMode={darkMode}
                  toggleDarkMode={() => setDarkMode(!darkMode)}
                  onLogout={handleLogout}
              />
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 dark:bg-gray-950 relative shadow-2xl overflow-hidden transition-colors duration-300">
      
      {/* Header (Only on Home) */}
      {activeTab === 'HOME' && (
        <header className="bg-white dark:bg-gray-900 p-4 pt-6 pb-2 shadow-sm z-10 sticky top-0 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-xl font-extrabold text-eco-600 dark:text-eco-500 flex items-center gap-2">
                    <Leaf className="w-6 h-6" /> ShareBite
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                    <MapPin className="w-3 h-3" /> <span className="underline">Current Location</span>
                </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition" onClick={() => setActiveTab('PROFILE')}>
                 <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          </div>

          <div className="flex gap-2 items-center mb-3">
             <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center px-3 py-2 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
                <input placeholder="Search food..." className="bg-transparent text-sm w-full outline-none ml-2 text-gray-800 dark:text-white placeholder-gray-400" />
             </div>
             <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
             </button>
          </div>

          {/* Toggle Map/List */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors">
             <button 
                onClick={() => setHomeMode('LIST')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition ${homeMode === 'LIST' ? 'bg-white dark:bg-gray-700 shadow text-eco-600 dark:text-eco-400' : 'text-gray-500 dark:text-gray-400'}`}
             >
                <List className="w-4 h-4" /> Feed
             </button>
             <button 
                onClick={() => setHomeMode('MAP')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-medium transition ${homeMode === 'MAP' ? 'bg-white dark:bg-gray-700 shadow text-eco-600 dark:text-eco-400' : 'text-gray-500 dark:text-gray-400'}`}
             >
                <MapIcon className="w-4 h-4" /> Near Me
             </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
             {['All', 'Veg', 'Halal', 'Bakery', 'Homemade'].map(f => (
                 <button 
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${filterType === f ? 'bg-eco-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                 >
                    {f}
                 </button>
             ))}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          
          {activeTab === 'HOME' && homeMode === 'LIST' && (
              <div className="p-4 pb-24 animate-fade-in">
                  {filteredItems.map(item => (
                      <FoodCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                  ))}
                  {filteredItems.length === 0 && (
                      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                          <p>No food items found.</p>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'HOME' && homeMode === 'MAP' && (
              <div className="animate-fade-in h-full">
                  <MapMock items={filteredItems} onItemSelect={(item) => setSelectedItem(item)} />
              </div>
          )}

          {activeTab === 'CHAT' && (
              <div className="h-full bg-white dark:bg-gray-900 animate-fade-in transition-colors duration-300">
                  {activeChatId ? (
                      <ChatScreen 
                          session={chatSessions.find(s => s.id === activeChatId)!}
                          currentUser={CURRENT_USER}
                          onSendMessage={handleSendMessage}
                          onBack={() => setActiveChatId(null)}
                      />
                  ) : (
                      <div className="h-full flex flex-col">
                          <div className="p-4 border-b dark:border-gray-800">
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
                          </div>
                          
                          {chatSessions.length === 0 ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8 text-center">
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                      <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                  </div>
                                  <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">No active chats</p>
                                  <p className="text-xs">Claim food to start a conversation with a donor!</p>
                              </div>
                          ) : (
                              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                  {chatSessions.map(session => (
                                      <div 
                                        key={session.id} 
                                        onClick={() => setActiveChatId(session.id)}
                                        className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                                      >
                                          <div className="relative">
                                              <img src={session.otherUserAvatar} className="w-12 h-12 rounded-full object-cover" />
                                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <div className="flex justify-between items-center mb-1">
                                                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{session.otherUserName}</h3>
                                                  <span className="text-xs text-gray-400">
                                                      {new Date(session.lastMessageTime || 0).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                  </span>
                                              </div>
                                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.lastMessage || 'Start chatting'}</p>
                                              <p className="text-xs text-eco-600 dark:text-eco-400 mt-1 flex items-center gap-1">
                                                  <ShoppingBag className="w-3 h-3" /> {session.itemTitle}
                                              </p>
                                          </div>
                                          <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'PROFILE' && (
              <ProfileScreen user={CURRENT_USER} onOpenSettings={() => setIsSettingsOpen(true)} />
          )}

      </main>

      {/* Floating Action Button for Post */}
      {activeTab === 'HOME' && (
        <div className="absolute bottom-24 right-4 z-20">
            <button 
                onClick={() => setIsPosting(true)}
                className="bg-warm-500 text-white p-4 rounded-full shadow-lg shadow-warm-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-2 pb-6 flex justify-around items-center absolute bottom-0 w-full z-20 transition-colors duration-300">
          <button 
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'HOME' ? 'text-eco-600 dark:text-eco-500' : 'text-gray-400 dark:text-gray-500'}`}
          >
              <MapIcon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('CHAT')}
            className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'CHAT' ? 'text-eco-600 dark:text-eco-500' : 'text-gray-400 dark:text-gray-500'}`}
          >
              <div className="relative">
                <MessageCircle className="w-6 h-6 mb-1" />
                {chatSessions.length > 0 && activeTab !== 'CHAT' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white dark:border-gray-900"></div>
                )}
              </div>
              <span className="text-[10px] font-medium">Chat</span>
          </button>

          <button 
            onClick={() => setActiveTab('PROFILE')}
            className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'PROFILE' ? 'text-eco-600 dark:text-eco-500' : 'text-gray-400 dark:text-gray-500'}`}
          >
              <UserIcon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Profile</span>
          </button>
      </nav>

    </div>
  );
};

export default App;