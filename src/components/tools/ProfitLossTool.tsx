import React, { useState } from 'react';
import { UserProfile, ProfitLossResult } from '../../types';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/storage';

interface ProfitLossToolProps {
  userProfile: UserProfile;
}

export const ProfitLossTool: React.FC<ProfitLossToolProps> = ({ userProfile }) => {
  const [investment, setInvestment] = useState<number>(userProfile.investmentCapacity || 100000);
  const [sales, setSales] = useState<number>(150000);
  const [expenses, setExpenses] = useState<number>(75000);

  const revenue = sales;
  const netProfit = revenue - expenses;
  const profitMarginPercent = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : '0';
  const status = netProfit > 0 ? 'Profit' : netProfit < 0 ? 'Loss' : 'Break-even';

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            📊
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Profit & Loss Calculator</h2>
            <p className="text-xs text-slate-400">Analyze cash flow, net margins, and AI financial recommendations</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Initial Capital Investment: <span className="text-indigo-300 font-bold">{formatCurrencyINR(investment)}</span>
            </label>
            <input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Monthly Sales Revenue: <span className="text-emerald-400 font-bold">{formatCurrencyINR(sales)}</span>
            </label>
            <input
              type="number"
              value={sales}
              onChange={(e) => setSales(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Monthly Operating Expenses: <span className="text-amber-400 font-bold">{formatCurrencyINR(expenses)}</span>
            </label>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Real-Time Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">Financial Status</span>
          <div className="my-2 flex items-center gap-2">
            {netProfit >= 0 ? (
              <span className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> PROFIT
              </span>
            ) : (
              <span className="p-2 rounded-2xl bg-rose-500/20 text-rose-400 font-black text-sm flex items-center gap-1">
                <TrendingDown className="w-4 h-4" /> LOSS
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">Net Return on Sales</span>
        </div>

        {/* Net Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">Net Monthly Profit</span>
          <div className="my-2">
            <span
              className={`text-2xl font-black ${
                netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrencyINR(netProfit)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Sales minus Operating Expenses</span>
        </div>

        {/* Margin % */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">Profit Margin %</span>
          <div className="my-2">
            <span className="text-2xl font-black text-teal-300">{profitMarginPercent}%</span>
          </div>
          <span className="text-[11px] text-slate-400">Target benchmark: 20% to 40%</span>
        </div>

        {/* Cash Flow */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">Monthly Cash Flow</span>
          <div className="my-2">
            <span className="text-2xl font-black text-indigo-300">{formatCurrencyINR(netProfit)}</span>
          </div>
          <span className="text-[11px] text-slate-400">Available liquidity for reinvestment</span>
        </div>
      </div>

      {/* AI Financial Recommendations */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-sm text-indigo-300 flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" /> AI Financial Mentor Analysis
        </h3>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            • <strong className="text-white">Margin Assessment:</strong> Your projected margin of{' '}
            <span className="text-emerald-400 font-bold">{profitMarginPercent}%</span> is{' '}
            {Number(profitMarginPercent) > 25 ? 'healthy and sustainable for retail expansion.' : 'on the lower side. Consider negotiating raw material prices or adding higher-margin add-ons.'}
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            • <strong className="text-white">Break-even Horizon:</strong> With a capital investment of{' '}
            {formatCurrencyINR(investment)}, your estimated capital recovery time is approx{' '}
            <span className="text-teal-300 font-bold">
              {netProfit > 0 ? (investment / netProfit).toFixed(1) : 'N/A'} months
            </span>.
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            • <strong className="text-white">Cash Flow Tip:</strong> Reserve at least 15% of net profit into a rainy-day fund for off-season fluctuations in {userProfile.city}.
          </div>
        </div>
      </div>
    </div>
  );
};
