import React, { useState } from 'react';
import { UserProfile, EmployeePlanResult } from '../../types';
import { Users, Sparkles, UserCheck, DollarSign, Briefcase } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/storage';

interface EmployeePlannerToolProps {
  userProfile: UserProfile;
}

export const EmployeePlannerTool: React.FC<EmployeePlannerToolProps> = ({ userProfile }) => {
  const [businessType, setBusinessType] = useState<string>(userProfile.currentBusiness || 'Retail Outlet & Delivery');
  const [targetRevenue, setTargetRevenue] = useState<number>(150000);

  const [plan, setPlan] = useState<EmployeePlanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/employee-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, monthlyTargetRevenue: targetRevenue, userProfile }),
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
      <div className="bg-gradient-to-r from-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            👥
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Employee & Hiring Planner</h2>
            <p className="text-xs text-slate-400">
              Staffing roles, salary benchmarks, and monthly team budget for <span className="text-cyan-300 font-semibold">{userProfile.city}</span>
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Monthly Revenue Goal</label>
            <input
              type="number"
              value={targetRevenue}
              onChange={(e) => setTargetRevenue(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Consulting Hiring Benchmarks...' : 'Generate Employee & Salary Plan'}
        </button>
      </div>

      {/* Plan Results */}
      {plan && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Recommended Team Size</span>
              <h3 className="text-2xl font-black text-cyan-300 mt-0.5">{plan.totalEmployees} Staff Members</h3>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Est. Monthly Payroll Expense</span>
              <h3 className="text-2xl font-black text-emerald-400 mt-0.5">
                {formatCurrencyINR(plan.totalMonthlyExpense)}
              </h3>
            </div>
          </div>

          {/* Roles Table */}
          <div>
            <h4 className="font-bold text-sm text-slate-200 mb-3">Recommended Staffing Breakdown</h4>
            <div className="space-y-2">
              {plan.roles?.map((r, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{r.role}</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-[10px]">
                        Qty: {r.count}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.priority === 'High'
                            ? 'bg-rose-500/20 text-rose-300'
                            : r.priority === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        Priority: {r.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">{r.responsibilities}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Monthly Salary</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {formatCurrencyINR(r.salaryPerMonth)} / mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-xs text-slate-300">
            <span className="font-bold text-cyan-300 block mb-1">💡 Hiring Advice:</span>
            {plan.aiAdvice}
          </div>
        </div>
      )}
    </div>
  );
};
