import React, { useState } from 'react';
import { UserProfile, BusinessPlanResult } from '../types';
import { FileText, Sparkles, Download, Copy, Check, Printer, ShieldAlert } from 'lucide-react';

interface BusinessPlanViewProps {
  userProfile: UserProfile;
}

export const BusinessPlanView: React.FC<BusinessPlanViewProps> = ({ userProfile }) => {
  const [businessName, setBusinessName] = useState<string>(
    userProfile.currentBusiness || 'GreenLeaf Organic Retail'
  );
  const [category, setCategory] = useState<string>(userProfile.businessCategory || 'Retail & E-commerce');
  const [plan, setPlan] = useState<BusinessPlanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, category, userProfile }),
      });

      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (e) {
      // Handled silently with fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPlan = () => {
    if (!plan) return;
    const planText = `
BUSINESS PLAN: ${plan.title || businessName}
City: ${userProfile.city}, ${userProfile.state}
Prepared for: ${userProfile.fullName}

1. EXECUTIVE SUMMARY
${plan.executiveSummary}

2. MARKET ANALYSIS
${plan.marketAnalysis}

3. COMPETITOR ANALYSIS
${plan.competitorAnalysis}

4. SWOT ANALYSIS
Strengths: ${plan.swotAnalysis?.strengths?.join(', ')}
Weaknesses: ${plan.swotAnalysis?.weaknesses?.join(', ')}
Opportunities: ${plan.swotAnalysis?.opportunities?.join(', ')}
Threats: ${plan.swotAnalysis?.threats?.join(', ')}

5. MARKETING PLAN
${plan.marketingPlan}

6. FINANCIAL PLAN
${plan.financialPlan}

7. GROWTH STRATEGY
${plan.growthStrategy}

8. RISK ANALYSIS
${plan.riskAnalysis}
`;
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-24 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl">
            📄
          </div>
          <div>
            <h2 className="text-xl font-black text-white">AI Business Plan Generator</h2>
            <p className="text-xs text-slate-400">
              Generate a formal bankable business plan in <span className="text-teal-300 font-semibold">{userProfile.preferredLanguage}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Proposed Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Industry / Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Generating Complete Business Document...' : 'Generate Comprehensive Business Plan'}
        </button>
      </div>

      {/* Document View */}
      {plan && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                Official Business Document
              </span>
              <h3 className="text-xl font-black text-white mt-1">{plan.title || businessName}</h3>
              <p className="text-xs text-slate-400">
                Location: {userProfile.city}, {userProfile.state} • Author: {userProfile.fullName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPlan}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
            </div>
          </div>

          <div className="space-y-5 text-xs text-slate-200 leading-relaxed">
            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-emerald-400 mb-1">1. Executive Summary</h4>
              <p>{plan.executiveSummary}</p>
            </section>

            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-teal-300 mb-1">2. Market Analysis</h4>
              <p>{plan.marketAnalysis}</p>
            </section>

            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-indigo-300 mb-1">3. Competitor Analysis</h4>
              <p>{plan.competitorAnalysis}</p>
            </section>

            {/* SWOT Matrix */}
            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-amber-300 mb-3">4. SWOT Matrix</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block mb-1">💪 Strengths</span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {plan.swotAnalysis?.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-rose-500/20">
                  <span className="font-bold text-rose-400 block mb-1">⚠️ Weaknesses</span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {plan.swotAnalysis?.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-teal-500/20">
                  <span className="font-bold text-teal-300 block mb-1">🚀 Opportunities</span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {plan.swotAnalysis?.opportunities?.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-amber-500/20">
                  <span className="font-bold text-amber-400 block mb-1">⚡ Threats</span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                    {plan.swotAnalysis?.threats?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-purple-400 mb-1">5. Marketing & Acquisition Plan</h4>
              <p>{plan.marketingPlan}</p>
            </section>

            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-emerald-400 mb-1">6. Financial Projections</h4>
              <p>{plan.financialPlan}</p>
            </section>

            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-cyan-300 mb-1">7. Growth Strategy</h4>
              <p>{plan.growthStrategy}</p>
            </section>

            <section className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="font-bold text-sm text-rose-400 mb-1">8. Risk Analysis & Mitigation</h4>
              <p>{plan.riskAnalysis}</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
