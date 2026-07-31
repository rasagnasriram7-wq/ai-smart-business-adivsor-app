import React, { useState } from 'react';
import { UserProfile, IncomeGoalPlanResult } from '../../types';
import { Target, Sparkles, TrendingUp, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/storage';

interface IncomeGoalPlannerToolProps {
  userProfile: UserProfile;
}

export const IncomeGoalPlannerTool: React.FC<IncomeGoalPlannerToolProps> = ({ userProfile }) => {
  const [targetIncome, setTargetIncome] = useState<number>(100000);
  const [plan, setPlan] = useState<IncomeGoalPlanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculateGoal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/income-goal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetIncomeAmount: targetIncome, userProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        setPlan(data);
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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            🎯
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Income Goal Planner (₹1 Lakh/Mo Roadmap)</h2>
            <p className="text-xs text-slate-400">
              Target monthly net earnings plan for <span className="text-emerald-400 font-semibold">{userProfile.city}</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Select Your Target Net Monthly Profit: <span className="text-emerald-400 font-bold text-sm">{formatCurrencyINR(targetIncome)} / mo</span>
          </label>
          <input
            type="range"
            min="25000"
            max="500000"
            step="25000"
            value={targetIncome}
            onChange={(e) => setTargetIncome(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>₹25,000</span>
            <span>₹1,00,000 (Popular)</span>
            <span>₹2,50,000</span>
            <span>₹5,00,000</span>
          </div>
        </div>

        <button
          onClick={handleCalculateGoal}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Designing Goal Roadmap...' : `Generate ${formatCurrencyINR(targetIncome)}/Mo Roadmap`}
        </button>
      </div>

      {/* Plan Output */}
      {plan && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Monthly Target Sales</span>
              <span className="text-base font-extrabold text-emerald-400">{plan.monthlySalesTarget}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Est. Monthly Expenses</span>
              <span className="text-base font-extrabold text-amber-300">{plan.monthlyExpenses}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Target Customers / Mo</span>
              <span className="text-base font-extrabold text-teal-300 flex items-center gap-1">
                <Users className="w-4 h-4" /> {plan.customersRequiredPerMonth}
              </span>
            </div>
          </div>

          {/* Business Options */}
          <div>
            <h4 className="font-bold text-xs text-emerald-400 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" /> Recommended Business Models for This Goal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.bestBusinessOptions?.map((opt, i) => (
                <div key={i} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs font-semibold text-slate-200">
                  ✨ {opt}
                </div>
              ))}
            </div>
          </div>

          {/* Marketing & Growth Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
              <h4 className="font-bold text-xs text-teal-300 flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" /> Acquisition & Customer Funnel
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {plan.marketingPlan?.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
              <h4 className="font-bold text-xs text-rose-400 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Critical Risks to Avoid
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {plan.risksToAvoid?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
