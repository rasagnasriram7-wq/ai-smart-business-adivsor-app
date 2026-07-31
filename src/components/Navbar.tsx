import React from 'react';
import { UserProfile, Language } from '../types';
import { Sparkles, Globe, Bell, Smartphone, Monitor, Moon, Sun, UserCheck } from 'lucide-react';

interface NavbarProps {
  userProfile: UserProfile;
  onLanguageChange: (lang: Language) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenProfile: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

const LANGUAGES: Language[] = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi'];

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onLanguageChange,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenProfile,
  darkMode,
  onToggleDarkMode,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-emerald-400 text-lg">
              🎯
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AI Business Advisor
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                Gemma 4 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              {userProfile.city ? `${userProfile.city}, ${userProfile.state}` : 'Personal Business Mentor'} •{' '}
              <span className="text-emerald-400 font-medium">{userProfile.preferredLanguage}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-xl px-2 py-1.5 text-xs text-slate-200">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <select
              value={userProfile.preferredLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer text-xs"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-slate-100">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle (Mobile App Container vs Desktop View) */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Switch to Full Screen View' : 'Switch to Mobile App Preview'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-[11px]">Mobile Frame</span>
              </>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle theme mode"
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Profile Shortcut */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline max-w-[100px] truncate">{userProfile.fullName.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
