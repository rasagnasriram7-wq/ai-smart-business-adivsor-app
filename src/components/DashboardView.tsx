import React, { useEffect, useState } from 'react';
import { UserProfile, Language } from '../types';
import { TabType } from './BottomNav';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  TrendingUp,
  Wallet,
  Building,
  Target,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  RefreshCw,
  Calculator,
  Compass,
  Users,
  Megaphone,
  MapPin,
  ChevronRight,
  DollarSign,
  PieChart as PieIcon,
} from 'lucide-react';
import { formatCurrencyINR } from '../utils/storage';
import { getApiUrl } from '../config';

interface DashboardViewProps {
  userProfile: UserProfile;
  onChangeTab: (tab: TabType, toolFilter?: string) => void;
  onOpenQuickChat: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onChangeTab,
  onOpenQuickChat,
}) => {
  const [dailyTip, setDailyTip] = useState<any>(null);
  const [loadingTip, setLoadingTip] = useState<boolean>(false);

  // Financial Chart Data based on user profile budget
  const monthlyRevenue = userProfile.monthlyBudget * 1.8;
  const monthlyExpenses = userProfile.monthlyBudget * 0.9;
  const netProfit = monthlyRevenue - monthlyExpenses;

  const chartData = [
    { month: 'Jan', revenue: monthlyRevenue * 0.7, expenses: monthlyExpenses * 0.8, profit: (monthlyRevenue * 0.7) - (monthlyExpenses * 0.8) },
    { month: 'Feb', revenue: monthlyRevenue * 0.85, expenses: monthlyExpenses * 0.85, profit: (monthlyRevenue * 0.85) - (monthlyExpenses * 0.85) },
    { month: 'Mar', revenue: monthlyRevenue * 0.95, expenses: monthlyExpenses * 0.88, profit: (monthlyRevenue * 0.95) - (monthlyExpenses * 0.88) },
    { month: 'Apr', revenue: monthlyRevenue * 1.1, expenses: monthlyExpenses * 0.92, profit: (monthlyRevenue * 1.1) - (monthlyExpenses * 0.92) },
    { month: 'May', revenue: monthlyRevenue * 1.25, expenses: monthlyExpenses * 0.95, profit: (monthlyRevenue * 1.25) - (monthlyExpenses * 0.95) },
    { month: 'Jun', revenue: monthlyRevenue * 1.4, expenses: monthlyExpenses * 1.0, profit: (monthlyRevenue * 1.4) - (monthlyExpenses * 1.0) },
  ];

  const fetchDailyTip = async () => {
    setLoadingTip(true);
    try {
      const res = await fetch(getApiUrl('/api/ai/daily-mentor-tip'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile }),
      });
      if (res.ok) {
        const data = await res.json();
        setDailyTip(data);
      }
    } catch (e) {
      setDailyTip({
        dailyTip: 'Always track your gross margin before spending on mass digital advertising.',
        mistakeWarning: 'Avoid taking high-interest personal loans to fund initial unverified inventory.',
        motivationalQuote: '"Success usually comes to those who are too busy to be looking for it." - Henry David Thoreau',
        growthActionable: 'Focus on 10 loyal repeat customers in your city first.',
      });
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchDailyTip();
  }, [userProfile.preferredLanguage, userProfile.city]);

  return (
    <div className="space-y-6 pb-24 text-slate-100">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" /> Gemma 4 Business Mentor
              </span>
              <span className="text-xs text-slate-400">{userProfile.city}, {userProfile.state}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Welcome back, {userProfile.fullName.split(' ')[0]}! 👋
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Targeting: <span className="text-emerald-300 font-medium">{userProfile.businessGoals}</span> • Budget:{' '}
              <span className="text-emerald-300 font-bold">{formatCurrencyINR(userProfile.investmentCapacity)}</span>
            </p>
          </div>

          <button
            onClick={() => onChangeTab('chat')}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition hover:scale-105"
          >
            <Sparkles className="w-4 h-4" /> Ask AI Business Advisor
          </button>
        </div>
      </div>

      {/* Business Health Score & Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score Gauge */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Business Health Score</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-400">88</span>
            <span className="text-sm text-slate-400 font-semibold">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full w-[88%]" />
          </div>
          <p className="text-[11px] text-emerald-300 font-medium">
            ✅ Strong setup, ready for customer acquisition
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Est. Monthly Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-white">{formatCurrencyINR(monthlyRevenue)}</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.5% projected growth
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Est. Operating Expenses</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-white">{formatCurrencyINR(monthlyExpenses)}</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Rent, Utilities, Supplies & Salary
          </p>
        </div>

        {/* Profit */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Net Profit Margin</span>
            <PieIcon className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black text-emerald-400">{formatCurrencyINR(netProfit)}</span>
          </div>
          <p className="text-[11px] text-teal-300 font-medium">
            Margin: <span className="font-bold">50% Net</span>
          </p>
        </div>
      </div>

      {/* AI Daily Mentor Tip & Warning */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              💡
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Daily Business Mentor Insight</h3>
              <p className="text-[11px] text-slate-400">Personalized in {userProfile.preferredLanguage}</p>
            </div>
          </div>
          <button
            onClick={fetchDailyTip}
            disabled={loadingTip}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingTip ? 'animate-spin text-emerald-400' : ''}`} />
            Refresh
          </button>
        </div>

        {loadingTip ? (
          <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
            Consulting Gemma 4 AI Mentor for daily business wisdom...
          </div>
        ) : dailyTip ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> Today's Focus Tip
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{dailyTip.dailyTip}</p>
              {dailyTip.growthActionable && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-emerald-300 font-medium">
                  🚀 Action: {dailyTip.growthActionable}
                </div>
              )}
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Common Mistake Warning
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{dailyTip.mistakeWarning}</p>
              {dailyTip.motivationalQuote && (
                <p className="mt-2 text-[11px] text-amber-200/90 italic">
                  {dailyTip.motivationalQuote}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Financial Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100">Revenue & Expense Projections</h3>
              <p className="text-[11px] text-slate-400">6-Month Business Trajectory</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">₹ INR</span>
          </div>

          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Net Profit Trend */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100">Monthly Cash Flow Growth</h3>
              <p className="text-[11px] text-slate-400">Estimated Net Monthly Profit</p>
            </div>
            <span className="text-xs text-teal-400 font-semibold">+42.8%</span>
          </div>

          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Net Cashflow']}
                />
                <Line type="monotone" dataKey="profit" stroke="#14b8a6" strokeWidth={3} dot={{ fill: '#14b8a6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Business Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-slate-100">AI Business Advisory Suite</h3>
          <button
            onClick={() => onChangeTab('tools')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View All Tools <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {/* Startup Idea Generator */}
          <button
            onClick={() => onChangeTab('tools', 'ideas')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-emerald-300">Startup Ideas</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Based on budget & city</p>
          </button>

          {/* Startup Cost Estimator */}
          <button
            onClick={() => onChangeTab('tools', 'cost')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-teal-300">Cost Estimator</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Rent, materials & setup</p>
          </button>

          {/* Low Budget Suggestions */}
          <button
            onClick={() => onChangeTab('tools', 'lowbudget')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-300">Low Budget Ideas</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">₹10k to ₹2 Lakh</p>
          </button>

          {/* Profit & Loss Calculator */}
          <button
            onClick={() => onChangeTab('tools', 'pnl')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <PieIcon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-indigo-300">P&L Calculator</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Profit margin & cashflow</p>
          </button>

          {/* Location Advisor */}
          <button
            onClick={() => onChangeTab('tools', 'location')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-rose-300">Best Locations</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Footfall & rent analysis</p>
          </button>

          {/* Employee Planner */}
          <button
            onClick={() => onChangeTab('tools', 'employee')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-cyan-300">Employee Planner</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Hiring roles & salary</p>
          </button>

          {/* Marketing Strategy */}
          <button
            onClick={() => onChangeTab('tools', 'marketing')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Megaphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200 group-hover:text-purple-300">Marketing Strategy</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Insta, WhatsApp & Local</p>
          </button>

          {/* ₹1 Lakh/Month Goal Planner */}
          <button
            onClick={() => onChangeTab('tools', 'incomegoal')}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 transition text-left group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-emerald-300">₹1 Lakh/Mo Roadmap</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">High-income roadmap</p>
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar for Chat */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <h3 className="font-bold text-xs text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Quick Business Mentor Queries
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Which business should I start in ' + userProfile.city + '?',
            'How can I earn ₹1 lakh per month?',
            'How can I increase sales with zero marketing budget?',
            'Why am I losing money on inventory?',
            'How much investment do I need for a cloud kitchen?',
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => onOpenQuickChat(promptText)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs text-left transition font-medium"
            >
              💬 "{promptText}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
