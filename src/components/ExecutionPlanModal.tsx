import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, CheckCircle2, Clock, Wrench, FileText, Users, Megaphone, Lightbulb, X } from 'lucide-react';

interface ExecutionPlanModalProps {
  businessTitle: string;
  userProfile: UserProfile;
  onClose: () => void;
}

export const ExecutionPlanModal: React.FC<ExecutionPlanModalProps> = ({
  businessTitle,
  userProfile,
  onClose,
}) => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ai/execution-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessTitle, userProfile }),
        });

        if (res.ok) {
          const data = await res.json();
          setPlan(data);
        } else {
          throw new Error('Failed to load plan');
        }
      } catch (e: any) {
        setError('Failed to generate execution plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [businessTitle, userProfile]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl text-slate-100 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
              Execution Roadmap
            </span>
            <h2 className="text-xl font-extrabold mt-1">{businessTitle}</h2>
            <p className="text-xs text-emerald-100">Tailored for {userProfile.city} • Language: {userProfile.preferredLanguage}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center text-emerald-400 space-y-3 animate-pulse">
              <Sparkles className="w-8 h-8 mx-auto animate-spin" />
              <p className="text-sm font-semibold">
                Creating detailed step-by-step launch plan in {userProfile.preferredLanguage}...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs text-center">
              {error}
            </div>
          ) : plan ? (
            <>
              {/* Summary Header */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Timeline</span>
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4" /> {plan.timelineWeeks || '4-6 Weeks'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Capital Required</span>
                  <span className="text-sm font-bold text-teal-300 flex items-center gap-1.5 mt-0.5">
                    💰 {plan.totalBudgetEstimate || '₹1,50,000'}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Roadmap */}
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step-by-Step Launch Roadmap
                </h3>
                <div className="space-y-3">
                  {plan.steps?.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-3.5 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {step.phase}
                        </span>
                        <h4 className="font-bold text-xs text-white">{step.task}</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment & Licenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
                  <h4 className="font-bold text-xs text-emerald-400 flex items-center gap-2 mb-2">
                    <Wrench className="w-4 h-4" /> Required Equipment & Tools
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {plan.requiredEquipment?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
                  <h4 className="font-bold text-xs text-teal-400 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" /> Licenses & Government Registrations
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {plan.licensesAndPermits?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Marketing & Hiring Summaries */}
              <div className="space-y-3">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
                  <h4 className="font-bold text-xs text-purple-400 flex items-center gap-2 mb-1">
                    <Megaphone className="w-4 h-4" /> Initial Marketing Strategy
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{plan.marketingPlanSummary}</p>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
                  <h4 className="font-bold text-xs text-cyan-400 flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4" /> Staffing & Hiring Plan
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{plan.hiringPlanSummary}</p>
                </div>
              </div>

              {/* Success Tips */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4">
                <h4 className="font-bold text-xs text-emerald-300 flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" /> Key Mentor Success Tips
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-200 space-y-1">
                  {plan.successTips?.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
