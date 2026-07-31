import React, { useState } from 'react';
import { UserProfile, Language, ExperienceLevel } from '../types';
import { Sparkles, Building2, User, Wallet, Target, Globe, ChevronRight } from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isEditing?: boolean;
  onClose?: () => void;
}

const LANGUAGES: Language[] = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi'];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Expert'];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSave,
  isEditing = false,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...profile, onboardingCompleted: true });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                ✨
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {isEditing ? 'Edit Business Profile' : 'AI Smart Business Advisor Setup'}
                </h2>
                <p className="text-xs text-emerald-100">
                  Powered by Gemma 4 • Personalized for your location & budget
                </p>
              </div>
            </div>
            {isEditing && onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2 mt-4">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-white' : 'bg-white/30'}`} />
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP 1: Personal & Location Details */}
          {(step === 1 || isEditing) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400 font-semibold text-sm">
                <User className="w-4 h-4" /> Personal & Contact Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Age *</label>
                    <input
                      type="number"
                      required
                      value={profile.age}
                      onChange={(e) => handleChange('age', Number(e.target.value))}
                      placeholder="28"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
                    <select
                      value={profile.gender || 'Male'}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={profile.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={profile.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g. Hyderabad, Vijayawada, Bangalore"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={profile.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="e.g. Telangana, Andhra Pradesh"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Language *</label>
                  <select
                    value={profile.preferredLanguage}
                    onChange={(e) => handleChange('preferredLanguage', e.target.value as Language)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang} className="bg-slate-900 text-white">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Education *</label>
                  <input
                    type="text"
                    required
                    value={profile.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    placeholder="e.g. Graduate, Diploma, High School"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Background */}
          {(step === 2 || isEditing) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400 font-semibold text-sm">
                <Building2 className="w-4 h-4" /> Occupation & Business Experience
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Occupation *</label>
                  <input
                    type="text"
                    required
                    value={profile.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="e.g. Student, Employee, Shop Owner"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Business Experience Level *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <button
                        type="button"
                        key={exp}
                        onClick={() => handleChange('experienceLevel', exp)}
                        className={`py-2 px-2 text-xs rounded-xl border transition-all ${
                          profile.experienceLevel === exp
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                            : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Current Business (Optional)</label>
                  <input
                    type="text"
                    value={profile.currentBusiness || ''}
                    onChange={(e) => handleChange('currentBusiness', e.target.value)}
                    placeholder="e.g. Tea stall, Franchise, None"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Business Category (Optional)</label>
                  <input
                    type="text"
                    value={profile.businessCategory || ''}
                    onChange={(e) => handleChange('businessCategory', e.target.value)}
                    placeholder="e.g. Retail, Food & Beverage, Tech, Services"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Goals */}
          {(step === 3 || isEditing) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400 font-semibold text-sm">
                <Wallet className="w-4 h-4" /> Financials & Growth Goals
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Monthly Operating Budget: <span className="text-emerald-400 font-bold">₹{profile.monthlyBudget.toLocaleString('en-IN')}</span>
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={profile.monthlyBudget}
                    onChange={(e) => handleChange('monthlyBudget', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>₹5,000</span>
                    <span>₹2,50,000</span>
                    <span>₹5,00,000+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Initial Investment Capacity: <span className="text-emerald-400 font-bold">₹{profile.investmentCapacity.toLocaleString('en-IN')}</span>
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={profile.investmentCapacity}
                    onChange={(e) => handleChange('investmentCapacity', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                    <span>₹10,00,000+</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Business Goals *</label>
                  <textarea
                    rows={2}
                    required
                    value={profile.businessGoals}
                    onChange={(e) => handleChange('businessGoals', e.target.value)}
                    placeholder="e.g. Open a 2nd branch in 6 months, achieve ₹1 Lakh monthly profit"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {!isEditing && step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium"
              >
                Back
              </button>
            ) : <div />}

            {!isEditing && step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25"
              >
                <Sparkles className="w-4 h-4" /> Save Profile & Start AI Advisor
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
