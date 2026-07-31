import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Wallet, Sparkles, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/storage';
import { getApiUrl } from '../../config';

interface LowBudgetToolProps {
  userProfile: UserProfile;
}

const BUDGET_CHIPS = [10000, 25000, 50000, 100000, 200000];

export const LowBudgetTool: React.FC<LowBudgetToolProps> = ({ userProfile }) => {
  const [selectedBudget, setSelectedBudget] = useState<number>(50000);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLowBudgetIdeas = async (amount: number) => {
    setSelectedBudget(amount);
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/low-budget-ideas'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetAmount: amount, userProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
      }
    } catch (e) {
      // Quiet fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header & Budget Chips */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            💰
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Low Budget Business Suggestions</h2>
            <p className="text-xs text-slate-400">
              Profitable business ideas starting from micro budgets in <span className="text-amber-400 font-semibold">{userProfile.city}</span>
            </p>
          </div>
        </div>

        <label className="block text-xs font-semibold text-slate-300 mb-2">Select Target Capital Limit:</label>
        <div className="flex flex-wrap gap-2.5">
          {BUDGET_CHIPS.map((amt) => (
            <button
              key={amt}
              onClick={() => fetchLowBudgetIdeas(amt)}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition ${
                selectedBudget === amt
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {formatCurrencyINR(amt)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-amber-400 animate-pulse text-xs space-y-2">
          <Sparkles className="w-6 h-6 mx-auto animate-spin" />
          <p>Analyzing high-return businesses within {formatCurrencyINR(selectedBudget)}...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                    Budget: {item.setupCost || formatCurrencyINR(selectedBudget)}
                  </span>
                  <span className="text-[11px] text-teal-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Break-even: {item.breakEvenTime}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white mb-2">{item.title}</h3>

                <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-3 rounded-2xl mb-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Monthly Income</span>
                    <span className="font-bold text-emerald-400">{item.expectedMonthlyIncome}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Monthly Profit</span>
                    <span className="font-bold text-teal-300">{item.expectedMonthlyProfit}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 text-[11px]">Required Materials / Equipment:</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {Array.isArray(item.materialsNeeded) ? item.materialsNeeded.join(', ') : item.materialsNeeded}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-amber-300 text-[11px] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Key Success Factor:
                    </span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{item.keySuccessFactor}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
