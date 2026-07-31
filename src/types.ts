export type Language = 'English' | 'Telugu' | 'Hindi' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Marathi';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface UserProfile {
  fullName: string;
  age: number | string;
  gender?: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  preferredLanguage: Language;
  education: string;
  occupation: string;
  experienceLevel: ExperienceLevel;
  currentBusiness?: string;
  businessCategory?: string;
  monthlyBudget: number;
  investmentCapacity: number;
  businessGoals: string;
  onboardingCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export interface BusinessIdea {
  id: string;
  title: string;
  category: string;
  investmentRequired: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  monthlyIncomeEstimate: string;
  profitEstimate: string;
  risks: string[];
  growthOpportunities: string[];
  description: string;
  targetAudience: string;
}

export interface CostCategory {
  name: string;
  amount: number;
  description: string;
}

export interface CostEstimateResult {
  totalInvestment: number;
  breakdown: CostCategory[];
  cityNotes: string;
  aiTip: string;
}

export interface ProfitLossResult {
  investment: number;
  sales: number;
  expenses: number;
  revenue: number;
  netProfit: number;
  profitMarginPercent: number;
  monthlyCashFlow: number;
  status: 'Profit' | 'Loss' | 'Break-even';
  aiSuggestions: string[];
}

export interface MarketingStrategyResult {
  instagram: string[];
  facebook: string[];
  whatsApp: string[];
  googleBusiness: string[];
  offline: string[];
  branding: string[];
  retention: string[];
}

export interface EmployeeRolePlan {
  role: string;
  count: number;
  responsibilities: string;
  salaryPerMonth: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface EmployeePlanResult {
  totalEmployees: number;
  totalMonthlyExpense: number;
  roles: EmployeeRolePlan[];
  aiAdvice: string;
}

export interface LocationSuggestion {
  placeType: string;
  recommendedAreas: string[];
  customerDemand: 'High' | 'Very High' | 'Moderate';
  competition: 'Low' | 'Medium' | 'High';
  estimatedRent: string;
  reason: string;
}

export interface IncomeGoalPlanResult {
  targetIncome: string;
  bestBusinessOptions: string[];
  requiredInvestment: string;
  customersRequiredPerMonth: string;
  monthlySalesTarget: string;
  monthlyExpenses: string;
  expectedProfit: string;
  marketingPlan: string[];
  growthRoadmap: string[];
  risksToAvoid: string[];
}

export interface BusinessPlanResult {
  title: string;
  executiveSummary: string;
  marketAnalysis: string;
  competitorAnalysis: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketingPlan: string;
  financialPlan: string;
  growthStrategy: string;
  riskAnalysis: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'tip' | 'reminder' | 'milestone' | 'market';
  read: boolean;
}

export interface DashboardMetric {
  businessHealthScore: number;
  revenue: number;
  expenses: number;
  profit: number;
  growthRate: number;
}
