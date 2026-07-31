import React from 'react';
import { UserProfile, Language } from '../types';
import { User, Edit3, Globe, Wallet, Trash2, ShieldCheck, Sparkles, Building, Target } from 'lucide-react';
import { formatCurrencyINR } from '../utils/storage';

interface ProfileSettingsViewProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onLanguageChange: (lang: Language) => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetAccount: () => void;
}

const LANGUAGES: Language[] = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi'];

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  userProfile,
  onEditProfile,
  onLanguageChange,
  onUpdateProfile,
  onResetAccount,
}) => {
  return (
    <div className="space-y-6 pb-24 text-slate-100">
      {/* Profile Summary Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-black text-2xl text-emerald-400">
                {userProfile.fullName.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{userProfile.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  {userProfile.experienceLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {userProfile.occupation} • {userProfile.city}, {userProfile.state}
              </p>
              <p className="text-xs text-emerald-300 font-semibold mt-1">
                Preferred Language: {userProfile.preferredLanguage}
              </p>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Edit3 className="w-4 h-4" /> Edit Full Profile
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal & Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
          <h3 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Personal & Contact Details
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Age / Gender:</span>
              <span className="font-medium text-white">
                {userProfile.age} yrs • {userProfile.gender || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Mobile:</span>
              <span className="font-medium text-white">{userProfile.mobile}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Email:</span>
              <span className="font-medium text-white">{userProfile.email}</span>
            </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Education:</span>
              <span className="font-medium text-white">{userProfile.education}</span>
            </div>
          </div>
        </div>

        {/* Business & Budget */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
          <h3 className="font-bold text-xs text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Capital & Goals
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Current Business:</span>
              <span className="font-medium text-white">{userProfile.currentBusiness || 'Exploring'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Monthly Budget:</span>
              <span className="font-bold text-emerald-400">{formatCurrencyINR(userProfile.monthlyBudget)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Initial Investment Capital:</span>
              <span className="font-bold text-teal-300">{formatCurrencyINR(userProfile.investmentCapacity)}</span>
            </div>
            <div className="py-1.5">
              <span className="text-slate-400 block mb-0.5">Primary Business Goals:</span>
              <p className="font-medium text-white bg-slate-800/60 p-2 rounded-xl text-[11px] leading-relaxed">
                {userProfile.businessGoals}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Settings: Language & Budget Sliders */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" /> Quick Preferences
        </h3>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Switch Preferred AI Language:</label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  userProfile.preferredLanguage === lang
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Account Reset */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs text-rose-400">Reset Account & Stored Data</h4>
            <p className="text-[11px] text-slate-400">Clear local profile and restart onboarding setup</p>
          </div>

          <button
            onClick={onResetAccount}
            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-bold transition"
          >
            <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
