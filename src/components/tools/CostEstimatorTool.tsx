import React, { useState } from 'react';
import { UserProfile, CostEstimateResult } from '../../types';
import { Calculator, Sparkles, Building, Info, CheckCircle2 } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/storage';
import { getApiUrl } from '../../config';

interface CostEstimatorToolProps {
  userProfile: UserProfile;
}

export const CostEstimatorTool: React.FC<CostEstimatorToolProps> = ({ userProfile }) => {
  const [businessType, setBusinessType] = useState<string>(userProfile.currentBusiness || 'Retail Tea & Snack Outlet');
  const [city, setCity] = useState<string>(userProfile.city || 'Hyderabad');
  const [scale, setScale] = useState<string>('Small Outlet');

  const [result, setResult] = useState<CostEstimateResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEstimate = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/cost-estimator'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, city, scale, userProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      // Quiet fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Tool Header */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            🧮
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Startup Cost Estimator</h2>
            <p className="text-xs text-slate-400">
              Itemized budget for <span className="text-teal-400 font-semibold">{userProfile.city}</span> market conditions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Business Type / Idea</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Cloud Kitchen, Clothing Store, Cafe"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">City / Location</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Hyderabad, Visakhapatnam"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Scale / Size</label>
            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="Micro / Kiosk">Micro / Kiosk (Small footprint)</option>
              <option value="Small Outlet">Small Outlet (Standard shop)</option>
              <option value="Medium Store">Medium Store / Multi-staff</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleEstimate}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Calculating City Cost Benchmark...' : 'Calculate Itemized Startup Cost'}
        </button>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="bg-gradient-to-r from-teal-950 to-slate-900 border border-teal-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-medium">Estimated Total Capital Required</span>
              <h3 className="text-3xl font-black text-teal-300 mt-0.5">
                {formatCurrencyINR(result.totalInvestment)}
              </h3>
            </div>
            <div className="text-right text-xs text-slate-300 max-w-xs">
              <span className="text-amber-400 font-semibold flex items-center gap-1 justify-end">
                <Info className="w-3.5 h-3.5" /> City Disclaimer
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">{result.cityNotes}</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div>
            <h4 className="font-bold text-sm text-slate-200 mb-3">Itemized Expense Breakdown</h4>
            <div className="space-y-2">
              {result.breakdown?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-100">{item.name}</span>
                    <p className="text-[11px] text-slate-400">{item.description}</p>
                  </div>
                  <span className="font-extrabold text-teal-300 text-sm ml-4">
                    {formatCurrencyINR(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Optimization Tip */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4" /> AI Cost Saving Advice
            </span>
            <p className="text-slate-300 leading-relaxed">{result.aiTip}</p>
          </div>
        </div>
      )}
    </div>
  );
};
