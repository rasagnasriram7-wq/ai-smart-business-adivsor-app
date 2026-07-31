import { UserProfile, NotificationItem, ChatMessage } from '../types';

const USER_PROFILE_KEY = 'ai_business_advisor_user_profile';
const CHAT_HISTORY_KEY = 'ai_business_advisor_chat_history';
const NOTIFICATIONS_KEY = 'ai_business_advisor_notifications';

export const defaultUserProfile: UserProfile = {
  fullName: 'Rajesh Kumar',
  age: 28,
  gender: 'Male',
  mobile: '+91 98765 43210',
  email: 'rajesh.kumar@example.com',
  city: 'Hyderabad',
  state: 'Telangana',
  preferredLanguage: 'English',
  education: 'Bachelor of Technology',
  occupation: 'Software Engineer & Aspiring Founder',
  experienceLevel: 'Beginner',
  currentBusiness: 'Exploring Tech Retail & Food Services',
  businessCategory: 'Retail / Service',
  monthlyBudget: 25000,
  investmentCapacity: 200000,
  businessGoals: 'Start a high-margin business and achieve ₹1 Lakh net monthly income within 12 months.',
  onboardingCompleted: false,
};

export const getStoredUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading user profile', e);
  }
  return defaultUserProfile;
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
};

export const getStoredChatHistory = (): ChatMessage[] => {
  try {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading chat history', e);
  }
  return [
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! I am your AI Smart Business Advisor (powered by Gemma 4). How can I assist your entrepreneurial journey today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: [
        'Which business should I start?',
        'How can I earn ₹1 lakh per month?',
        'How can I increase sales?',
        'Estimate startup costs for my city',
      ],
    },
  ];
};

export const saveChatHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat history', e);
  }
};

export const defaultNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Daily Business Tip',
    message: 'Always track your daily customer acquisition cost vs gross margin before expanding marketing spend.',
    timestamp: 'Today, 9:00 AM',
    type: 'tip',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Expense Reminder',
    message: 'Remember to record your weekly shop rent and electricity utility expenses in P&L calculator.',
    timestamp: 'Yesterday',
    type: 'reminder',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Market Milestone',
    message: 'High demand detected for cloud kitchens and specialty tea outlets in your area (Hyderabad).',
    timestamp: '2 days ago',
    type: 'market',
    read: true,
  },
];

export const getStoredNotifications = (): NotificationItem[] => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading notifications', e);
  }
  return defaultNotifications;
};

export const saveNotifications = (notifications: NotificationItem[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
};

export const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
