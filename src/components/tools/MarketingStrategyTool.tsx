import React, { useState } from 'react';
import { UserProfile, MarketingStrategyResult } from '../../types';
import { Megaphone, Sparkles, Instagram, Facebook, MessageSquare, MapPin, Award, HeartHandshake } from 'lucide-react';
import { getApiUrl } from '../../config';

interface MarketingStrategyToolProps {
  userProfile: UserProfile;
}

export const MarketingStrategyTool: React.FC<MarketingStrategyToolProps> = ({ userProfile }) => {
  const [businessType, setBusinessType] = useState<string>(userProfile.currentBusiness || 'Food & Beverage Outlet');
  const [targetAudience, setTargetAudience] = useState<string>('Students, College youth & Working Professionals');

  const [strategy, setStrategy] = useState<MarketingStrategyResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/marketing-strategy'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, targetAudience, userProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        setStrategy(data);
      }
    } catch (e) {
      // Quiet fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            📢
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Marketing Strategy Generator</h2>
            <p className="text-xs text-slate-400">
              Multi-channel growth tactics for <span className="text-purple-300 font-semibold">{userProfile.city}</span> in{' '}
              <span className="text-purple-300 font-semibold">{userProfile.preferredLanguage}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Business Type</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Customer Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Crafting Marketing Plan...' : 'Generate Multi-Channel Marketing Plan'}
        </button>
      </div>

      {/* Strategy Grid */}
      {strategy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Instagram */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <h3 className="font-bold text-sm text-pink-400 flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4" /> Instagram Growth Plan
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {strategy.instagram?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Facebook */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2 mb-2">
              <Facebook className="w-4 h-4" /> Facebook & Community Ads
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {strategy.facebook?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* WhatsApp */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" /> WhatsApp Business Marketing
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {strategy.whatsApp?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Google Business Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" /> Google Business & Local Maps SEO
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {strategy.googleBusiness?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Offline Marketing */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2 mb-2">
              <Award className="w-4 h-4" /> Offline & Local Banners/Flyers
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {strategy.offline?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Retention */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2 mb-2">
              <HeartHandshake className="w-4 h-4" /> Customer Retention & Loyalty
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {strategy.retention?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
