import React, { useState, useEffect } from 'react';
import { UserProfile, Language, NotificationItem } from './types';
import {
  getStoredUserProfile,
  saveUserProfile,
  defaultUserProfile,
  getStoredNotifications,
  saveNotifications,
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { AIChatView } from './components/AIChatView';
import { ToolsSuiteView } from './components/ToolsSuiteView';
import { BusinessPlanView } from './components/BusinessPlanView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

import { OnboardingModal } from './components/OnboardingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ExecutionPlanModal } from './components/ExecutionPlanModal';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toolFilter, setToolFilter] = useState<string>('ideas');

  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);
  const [executionPlanTitle, setExecutionPlanTitle] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(
    !userProfile.onboardingCompleted
  );

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveUserProfile(updated);
    setShowOnboardingModal(false);
  };

  const handleLanguageChange = (lang: Language) => {
    const updated = { ...userProfile, preferredLanguage: lang };
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  const handleOpenTool = (tab: TabType, filter?: string) => {
    setActiveTab(tab);
    if (filter) setToolFilter(filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuickChat = (query: string) => {
    setChatPrompt(query);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleResetAccount = () => {
    if (confirm('Are you sure you want to reset your business advisor profile?')) {
      localStorage.clear();
      setUserProfile(defaultUserProfile);
      setShowOnboardingModal(true);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Outer Shell - Supports Mobile Frame Mockup or Full View */}
      <div className={isMobileFrame ? 'max-w-[440px] mx-auto min-h-screen shadow-2xl bg-slate-950 border-x border-slate-800 my-0 sm:my-4 sm:rounded-[40px] overflow-hidden relative' : 'w-full min-h-screen'}>
        {/* Top Navbar */}
        <Navbar
          userProfile={userProfile}
          onLanguageChange={handleLanguageChange}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenProfile={() => setActiveTab('profile')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 pt-4">
          {activeTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              onChangeTab={handleOpenTool}
              onOpenQuickChat={handleOpenQuickChat}
            />
          )}

          {activeTab === 'chat' && (
            <AIChatView
              userProfile={userProfile}
              initialPrompt={chatPrompt}
              onClearInitialPrompt={() => setChatPrompt(undefined)}
            />
          )}

          {activeTab === 'tools' && (
            <ToolsSuiteView
              userProfile={userProfile}
              initialFilter={toolFilter}
              onGenerateExecutionPlan={(title) => setExecutionPlanTitle(title)}
            />
          )}

          {activeTab === 'plan' && <BusinessPlanView userProfile={userProfile} />}

          {activeTab === 'profile' && (
            <ProfileSettingsView
              userProfile={userProfile}
              onEditProfile={() => setShowOnboardingModal(true)}
              onLanguageChange={handleLanguageChange}
              onUpdateProfile={handleSaveProfile}
              onResetAccount={handleResetAccount}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      {/* Onboarding / Edit Profile Modal */}
      {showOnboardingModal && (
        <OnboardingModal
          initialProfile={userProfile}
          onSave={handleSaveProfile}
          isEditing={userProfile.onboardingCompleted}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearNotifications}
          onClose={() => setShowNotificationsModal(false)}
        />
      )}

      {/* Execution Plan Step-by-Step Modal */}
      {executionPlanTitle && (
        <ExecutionPlanModal
          businessTitle={executionPlanTitle}
          userProfile={userProfile}
          onClose={() => setExecutionPlanTitle(null)}
        />
      )}
    </div>
  );
}
