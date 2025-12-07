import React, { useState, useRef } from 'react';
import { Camera, Loader2, CheckCircle, AlertCircle, Upload, MapPin, Clock } from 'lucide-react';
import { analyzeFoodImage, fileToBase64 } from '../services/geminiService';
import { FoodItem, User } from '../types';

interface PostFoodFlowProps {
  onPostSuccess: (item: FoodItem) => void;
  onCancel: () => void;
  currentUser: User;
}

export const PostFoodFlow: React.FC<PostFoodFlowProps> = ({ onPostSuccess, onCancel, currentUser }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '1 Portion',
    category: 'General',
    isHalal: false,
    isVeg: false,
    pickupLocation: 'My Current Location',
    pickupTimeLimit: '2', // hours
    safetyConfirmed: false
  });

  const [aiData, setAiData] = useState<{freshness: number, verified: boolean} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(`data:image/jpeg;base64,${base64}`);
        
        // Call AI
        const analysis = await analyzeFoodImage(base64);
        
        setFormData(prev => ({
          ...prev,
          title: analysis.title,
          description: analysis.description,
          category: analysis.category,
          isHalal: analysis.isHalal,
          isVeg: analysis.isVeg,
        }));

        setAiData({
          freshness: analysis.freshnessScore,
          verified: analysis.safetyCheck
        });

        setStep(2);
      } catch (err) {
        console.error(err);
        alert("Failed to analyze image. Please try manually.");
        setStep(2); // Allow manual entry
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorAvatar: currentUser.avatar,
      donorRating: currentUser.rating,
      title: formData.title,
      description: formData.description,
      imageUrl: imagePreview || 'https://picsum.photos/400/300',
      quantity: formData.quantity,
      category: formData.category,
      isHalal: formData.isHalal,
      isVeg: formData.isVeg,
      preparedTime: new Date().toISOString(),
      expiryTime: Date.now() + (parseInt(formData.pickupTimeLimit) * 60 * 60 * 1000),
      pickupLocation: formData.pickupLocation,
      distance: 0.1,
      status: 'AVAILABLE',
      tags: aiData?.verified ? ['AI Verified'] : [],
      aiVerified: aiData?.verified || false
    };
    onPostSuccess(newItem);
  };

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      <div className="p-4 border-b flex items-center justify-between">
        <button onClick={onCancel} className="text-gray-500">Cancel</button>
        <h2 className="font-bold text-lg">Post Food</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Progress Bar */}
        <div className="flex mb-8 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-eco-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 relative">
            {loading ? (
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-eco-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600 font-medium">AI is analyzing freshness...</p>
              </div>
            ) : (
              <>
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">Take a photo of the food</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-eco-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-eco-700 transition"
                >
                  Upload Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
             {imagePreview && (
              <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                {aiData?.verified && (
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-eco-700 shadow">
                    <CheckCircle className="w-3 h-3" /> AI Verified
                  </div>
                )}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-eco-500 outline-none" 
                placeholder="e.g. Pasta Portion"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-eco-500 outline-none" 
                placeholder="e.g. 2 Servings"
              />
            </div>

             <div className="grid grid-cols-2 gap-4">
               <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                 <input 
                  type="checkbox" 
                  checked={formData.isHalal}
                  onChange={e => setFormData({...formData, isHalal: e.target.checked})}
                  className="w-4 h-4 text-eco-600"
                 />
                 <span className="text-sm">Halal</span>
               </label>
               <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                 <input 
                  type="checkbox" 
                  checked={formData.isVeg}
                  onChange={e => setFormData({...formData, isVeg: e.target.checked})}
                  className="w-4 h-4 text-eco-600"
                 />
                 <span className="text-sm">Vegetarian</span>
               </label>
             </div>

             <button onClick={() => setStep(3)} className="w-full bg-eco-600 text-white py-3 rounded-xl font-bold mt-4 shadow-lg hover:bg-eco-700">
               Next: Pickup Details
             </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-warm-600 flex-shrink-0" />
                <p className="text-sm text-warm-700">Please ensure food is hygienic and packed safely.</p>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                <div className="flex items-center gap-2 border rounded-lg p-2 bg-gray-50 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{formData.pickupLocation}</span>
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pick up within (hours)</label>
                <div className="flex items-center gap-2 border rounded-lg p-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <select 
                    value={formData.pickupTimeLimit}
                    onChange={e => setFormData({...formData, pickupTimeLimit: e.target.value})}
                    className="flex-1 bg-transparent outline-none"
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                  </select>
                </div>
             </div>

             <div className="pt-4 border-t">
               <label className="flex items-start gap-3 cursor-pointer">
                 <input 
                  type="checkbox" 
                  checked={formData.safetyConfirmed}
                  onChange={e => setFormData({...formData, safetyConfirmed: e.target.checked})}
                  className="mt-1 w-5 h-5 text-eco-600 rounded"
                 />
                 <span className="text-sm text-gray-700">
                   I confirm this food is safe to eat, was prepared hygienically, and contains no spoiled ingredients.
                 </span>
               </label>
             </div>

             <button 
              disabled={!formData.safetyConfirmed}
              onClick={handleSubmit} 
              className={`w-full py-3 rounded-xl font-bold mt-4 shadow-lg transition
                ${formData.safetyConfirmed ? 'bg-eco-600 text-white hover:bg-eco-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
             >
               Post Food Now
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
