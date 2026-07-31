import React, { useState } from 'react';
import { UserProfile, LocationSuggestion } from '../../types';
import { MapPin, Sparkles, Building2, Compass, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../config';

interface LocationAdvisorToolProps {
  userProfile: UserProfile;
}

export const LocationAdvisorTool: React.FC<LocationAdvisorToolProps> = ({ userProfile }) => {
  const [businessType, setBusinessType] = useState<string>(userProfile.currentBusiness || 'Specialty Cafe / Food Counter');
  const [city, setCity] = useState<string>(userProfile.city || 'Hyderabad');

  const [locations, setLocations] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/best-locations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, city, userProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        setLocations(data.locations || []);
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
      <div className="bg-gradient-to-r from-slate-900 to-rose-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            📍
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Best Business Location Advisor</h2>
            <p className="text-xs text-slate-400">
              Hotspots, footfall analysis & rental estimates for <span className="text-rose-300 font-semibold">{city}</span>
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Target City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          onClick={handleRecommend}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Analyzing Footfall & Rent Data...' : 'Find Best Locations in ' + city}
        </button>
      </div>

      {/* Locations Cards */}
      {locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                    {loc.placeType}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">
                    Rent: {loc.estimatedRent}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white mb-2">
                  {loc.recommendedAreas?.join(', ')}
                </h3>

                <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-3 rounded-2xl mb-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Customer Demand</span>
                    <span className="font-bold text-emerald-400">{loc.customerDemand}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Competition</span>
                    <span className="font-bold text-teal-300">{loc.competition}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-rose-300">Why Suitable:</strong> {loc.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
