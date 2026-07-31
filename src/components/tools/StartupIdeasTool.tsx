import React, { useState } from 'react';
import { UserProfile, BusinessIdea } from '../../types';
import { Lightbulb, Sparkles, AlertTriangle, TrendingUp, Layers, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/storage';
import { getApiUrl } from '../../config';

interface StartupIdeasToolProps {
  userProfile: UserProfile;
  onGenerateExecutionPlan: (title: string) => void;
}

export const StartupIdeasTool: React.FC<StartupIdeasToolProps> = ({
  userProfile,
  onGenerateExecutionPlan,
}) => {
  const [budget, setBudget] = useState<number>(userProfile.investmentCapacity || 100000);
  const [skills, setSkills] = useState<string>(userProfile.occupation || 'Retail & Management');
  const [location, setLocation] = useState<string>(userProfile.city || 'Hyderabad');
  const [interests, setInterests] = useState<string>(userProfile.businessGoals || 'Food, Tech, Retail');

  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/ai/startup-ideas'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          skills,
          location,
          interests,
          userProfile,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
      } else {
        throw new Error('Failed to fetch ideas');
      }
    } catch (e: any) {
      setError('Could not generate ideas right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Tool Title Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            💡
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Startup Idea Generator</h2>
            <p className="text-xs text-slate-400">
              Personalized ideas for <span className="text-emerald-400 font-semibold">{userProfile.city}</span> in{' '}
              <span className="text-emerald-400 font-semibold">{userProfile.preferredLanguage}</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Investment Budget: <span className="text-emerald-400 font-bold">{formatCurrencyINR(budget)}</span>
            </label>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Skills / Experience</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Location / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Interests / Category</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Consulting Gemma 4 AI...' : 'Generate Profitable Ideas'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Ideas List Grid */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.id || idea.title}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    {idea.category}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      idea.difficulty === 'Easy'
                        ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                        : idea.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {idea.difficulty} Complexity
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition mb-1">
                  {idea.title}
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">{idea.description}</p>

                <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-3 rounded-2xl mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Required Investment</span>
                    <span className="font-bold text-emerald-400">{idea.investmentRequired}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Monthly Profit</span>
                    <span className="font-bold text-teal-300">{idea.profitEstimate}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5" /> Growth Opportunities:
                    </span>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] mt-0.5 space-y-0.5">
                      {idea.growthOpportunities?.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-rose-400 flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Potential Risks:
                    </span>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] mt-0.5 space-y-0.5">
                      {idea.risks?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onGenerateExecutionPlan(idea.title)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>View Full Step-by-Step Execution Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
