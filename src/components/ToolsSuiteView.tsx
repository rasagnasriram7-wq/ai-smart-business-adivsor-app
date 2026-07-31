import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { StartupIdeasTool } from './tools/StartupIdeasTool';
import { CostEstimatorTool } from './tools/CostEstimatorTool';
import { LowBudgetTool } from './tools/LowBudgetTool';
import { ProfitLossTool } from './tools/ProfitLossTool';
import { MarketingStrategyTool } from './tools/MarketingStrategyTool';
import { EmployeePlannerTool } from './tools/EmployeePlannerTool';
import { LocationAdvisorTool } from './tools/LocationAdvisorTool';
import { IncomeGoalPlannerTool } from './tools/IncomeGoalPlannerTool';
import { Lightbulb, Calculator, Wallet, PieChart, Megaphone, Users, MapPin, Target } from 'lucide-react';

interface ToolsSuiteViewProps {
  userProfile: UserProfile;
  initialFilter?: string;
  onGenerateExecutionPlan: (title: string) => void;
}

export type ToolFilter = 'ideas' | 'cost' | 'lowbudget' | 'pnl' | 'marketing' | 'employee' | 'location' | 'incomegoal';

export const ToolsSuiteView: React.FC<ToolsSuiteViewProps> = ({
  userProfile,
  initialFilter = 'ideas',
  onGenerateExecutionPlan,
}) => {
  const [activeTool, setActiveTool] = useState<ToolFilter>((initialFilter as ToolFilter) || 'ideas');

  useEffect(() => {
    if (initialFilter) {
      setActiveTool(initialFilter as ToolFilter);
    }
  }, [initialFilter]);

  const toolsList: { id: ToolFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'ideas', label: 'Idea Generator', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'cost', label: 'Cost Estimator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'lowbudget', label: 'Low Budget Ideas', icon: <Wallet className="w-4 h-4" /> },
    { id: 'pnl', label: 'P&L Calculator', icon: <PieChart className="w-4 h-4" /> },
    { id: 'marketing', label: 'Marketing Strategy', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'employee', label: 'Employee Planner', icon: <Users className="w-4 h-4" /> },
    { id: 'location', label: 'Location Advisor', icon: <MapPin className="w-4 h-4" /> },
    { id: 'incomegoal', label: '₹1 Lakh/Mo Roadmap', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pb-24 text-slate-100">
      {/* Tool Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {toolsList.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tool.icon}
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div>
        {activeTool === 'ideas' && (
          <StartupIdeasTool
            userProfile={userProfile}
            onGenerateExecutionPlan={onGenerateExecutionPlan}
          />
        )}
        {activeTool === 'cost' && <CostEstimatorTool userProfile={userProfile} />}
        {activeTool === 'lowbudget' && <LowBudgetTool userProfile={userProfile} />}
        {activeTool === 'pnl' && <ProfitLossTool userProfile={userProfile} />}
        {activeTool === 'marketing' && <MarketingStrategyTool userProfile={userProfile} />}
        {activeTool === 'employee' && <EmployeePlannerTool userProfile={userProfile} />}
        {activeTool === 'location' && <LocationAdvisorTool userProfile={userProfile} />}
        {activeTool === 'incomegoal' && <IncomeGoalPlannerTool userProfile={userProfile} />}
      </div>
    </div>
  );
};
