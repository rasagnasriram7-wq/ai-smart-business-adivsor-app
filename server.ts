import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();
dotenv.config({ path: '.env.example' });
import {
  getDailyTipOffline,
  getChatResponseOffline,
  getStartupIdeasOffline,
  getExecutionPlanOffline,
  getCostEstimatorOffline,
  getLowBudgetIdeasOffline,
  getMarketingStrategyOffline,
  getEmployeePlanOffline,
  getLocationAdvisorOffline,
  getIncomeGoalPlanOffline,
  getBusinessPlanOffline,
} from './src/serverFallback';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory cache for repeated AI queries to save quota
const aiResponseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

function getCached(key: string) {
  const cached = aiResponseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCached(key: string, data: any) {
  aiResponseCache.set(key, { data, timestamp: Date.now() });
}

// Safely get GoogleGenAI client (returns null if key is missing or invalid)
const getAiClient = (): GoogleGenAI | null => {
  let apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key exists:", !!apiKey);
  if (!apiKey) {
    return null;
  }
  apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    return null;
  }
};

// Helper function to call Gemini with model fallback and dynamic offline knowledge base fallback
async function safeGenerateContent(
  ai: GoogleGenAI | null,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
    fallbackOfflineResponse: () => any;
  }
) {
  if (ai) {
    const modelsToTry = [
      params.primaryModel || 'gemini-3.6-flash',
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.1-pro-preview',
    ];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          return {
            text: response.text,
            modelUsed: model,
            isFallback: false,
          };
        }
      } catch (err: any) {
        console.error(`Gemini model ${model} error:`, err?.message || err);
      }
    }
  }

  // If AI client is null or all models hit quota/429/errors:
  const offlineData = params.fallbackOfflineResponse();
  const textResult = typeof offlineData === 'string' ? offlineData : JSON.stringify(offlineData);
  return {
    text: textResult,
    modelUsed: 'offline-knowledge-base',
    isFallback: true,
  };
}

// Helper to format chat history strictly for Gemini API requirements:
// 1. Must start with role 'user'
// 2. Roles must strictly alternate: 'user' -> 'model' -> 'user' -> 'model'
function formatChatContents(chatHistory: any[], currentMessage: string) {
  const formatted: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  if (Array.isArray(chatHistory)) {
    for (const msg of chatHistory) {
      if (!msg || !msg.text) continue;
      const role = msg.sender === 'user' ? 'user' : 'model';

      // Skip leading AI/model greetings
      if (formatted.length === 0 && role === 'model') {
        continue;
      }

      // Prevent consecutive duplicate roles
      if (formatted.length > 0 && formatted[formatted.length - 1].role === role) {
        formatted[formatted.length - 1].parts[0].text += '\n' + msg.text;
      } else {
        formatted.push({ role, parts: [{ text: msg.text }] });
      }
    }
  }

  // Safely incorporate current user message
  if (formatted.length > 0 && formatted[formatted.length - 1].role === 'user') {
    const lastText = formatted[formatted.length - 1].parts[0].text;
    if (!lastText.endsWith(currentMessage)) {
      formatted[formatted.length - 1].parts[0].text += '\n' + currentMessage;
    }
  } else {
    formatted.push({ role: 'user', parts: [{ text: currentMessage }] });
  }

  return formatted;
}

// Default system persona prompt
const getSystemPersonaPrompt = (userProfile?: any) => {
  const profileText = userProfile
    ? `
User Context:
- Name: ${userProfile.fullName || 'Entrepreneur'}
- Preferred Language: ${userProfile.preferredLanguage || 'English'}
- Location: ${userProfile.city || 'City'}, ${userProfile.state || 'State'}
- Experience Level: ${userProfile.experienceLevel || 'Beginner'}
- Monthly Budget: ₹${userProfile.monthlyBudget || 50000}
- Investment Capacity: ₹${userProfile.investmentCapacity || 100000}
- Current Business / Category: ${userProfile.currentBusiness || 'Exploring'} (${userProfile.businessCategory || 'General'})
- Goals: ${userProfile.businessGoals || 'Start and scale a profitable business'}
`
    : '';

  return `You are AI Smart Business Advisor (powered by Gemma 4), an elite, practical, and highly practical business mentor for entrepreneurs, startups, and small business owners in India and globally.

${profileText}

Key Principles:
1. Always adapt responses to the user's preferred language (${userProfile?.preferredLanguage || 'English'}). You must speak natively in that language (e.g. if Telugu, respond in clear Telugu; if Hindi, in Hindi; if English, in crisp English).
2. Give realistic estimates, explain assumptions, and state that business success depends on market conditions, execution, and local customer demand.
3. Keep answers action-oriented, clear, structured with easy bullet points, and actionable. Use currency symbol ₹ (INR) or local context where applicable.`;
};

// 1. AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userProfile, chatHistory } = req.body;
    const ai = getAiClient();
    const systemInstruction = getSystemPersonaPrompt(userProfile);

    const contents = formatChatContents(chatHistory, message || '');

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      fallbackOfflineResponse: () => getChatResponseOffline(message, userProfile),
    });

    res.json({ text: result.text, isFallback: result.isFallback });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    const fallbackText = getChatResponseOffline(req.body.message || '', req.body.userProfile);
    res.json({ text: fallbackText, isFallback: true });
  }
});

// 2. Startup Idea Generator
app.post('/api/ai/startup-ideas', async (req, res) => {
  try {
    const { budget, skills, location, interests, userProfile } = req.body;
    const cacheKey = `ideas_${budget}_${location}_${userProfile?.preferredLanguage}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json({ ideas: cached });

    const ai = getAiClient();
    const prompt = `Generate 4 highly tailored, practical startup/small business ideas based on:
- Budget: ₹${budget || userProfile?.investmentCapacity || 100000}
- Skills: ${skills || userProfile?.occupation || 'General management'}
- Location: ${location || userProfile?.city || 'India'}
- Interests: ${interests || userProfile?.businessGoals || 'Retail, Services'}
- Language: ${userProfile?.preferredLanguage || 'English'}

For each idea, return clean JSON matching the specified schema. Write descriptions and text in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              investmentRequired: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              monthlyIncomeEstimate: { type: Type.STRING },
              profitEstimate: { type: Type.STRING },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              growthOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
              targetAudience: { type: Type.STRING },
            },
            required: [
              'id',
              'title',
              'category',
              'investmentRequired',
              'difficulty',
              'monthlyIncomeEstimate',
              'profitEstimate',
              'risks',
              'growthOpportunities',
              'description',
              'targetAudience',
            ],
          },
        },
      },
      fallbackOfflineResponse: () => getStartupIdeasOffline(budget, skills, location, interests, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (pErr) {
      data = getStartupIdeasOffline(budget, skills, location, interests, userProfile);
    }

    setCached(cacheKey, data);
    res.json({ ideas: data, isFallback: result.isFallback });
  } catch (error: any) {
    const fallback = getStartupIdeasOffline(req.body.budget, req.body.skills, req.body.location, req.body.interests, req.body.userProfile);
    res.json({ ideas: fallback, isFallback: true });
  }
});

// 3. Execution Plan Endpoint
app.post('/api/ai/execution-plan', async (req, res) => {
  try {
    const { businessTitle, userProfile } = req.body;
    const cacheKey = `exec_${businessTitle}_${userProfile?.city}_${userProfile?.preferredLanguage}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const ai = getAiClient();
    const prompt = `Create a comprehensive step-by-step execution plan for starting a "${businessTitle}" in ${userProfile?.city || 'India'} with a budget of ₹${userProfile?.investmentCapacity || 100000}.
Respond in language: ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            timelineWeeks: { type: Type.STRING },
            totalBudgetEstimate: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  task: { type: Type.STRING },
                  details: { type: Type.STRING },
                },
                required: ['phase', 'task', 'details'],
              },
            },
            requiredEquipment: { type: Type.ARRAY, items: { type: Type.STRING } },
            licensesAndPermits: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketingPlanSummary: { type: Type.STRING },
            hiringPlanSummary: { type: Type.STRING },
            successTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'timelineWeeks',
            'totalBudgetEstimate',
            'steps',
            'requiredEquipment',
            'licensesAndPermits',
            'marketingPlanSummary',
            'hiringPlanSummary',
            'successTips',
          ],
        },
      },
      fallbackOfflineResponse: () => getExecutionPlanOffline(businessTitle, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getExecutionPlanOffline(businessTitle, userProfile);
    }

    setCached(cacheKey, data);
    res.json(data);
  } catch (error: any) {
    res.json(getExecutionPlanOffline(req.body.businessTitle, req.body.userProfile));
  }
});

// 4. Cost Estimator Endpoint
app.post('/api/ai/cost-estimator', async (req, res) => {
  try {
    const { businessType, city, scale, userProfile } = req.body;
    const cacheKey = `cost_${businessType}_${city}_${scale}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const ai = getAiClient();
    const prompt = `Estimate the realistic setup cost for a "${businessType}" in ${city || userProfile?.city || 'tier 2 city'}, scale: ${scale || 'small'}.
Breakdown should cover: Shop Rent, Furniture, Equipment, Raw Materials, Licenses & Registration, Marketing, Electricity, Internet, Miscellaneous.
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalInvestment: { type: Type.NUMBER },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
                required: ['name', 'amount', 'description'],
              },
            },
            cityNotes: { type: Type.STRING },
            aiTip: { type: Type.STRING },
          },
          required: ['totalInvestment', 'breakdown', 'cityNotes', 'aiTip'],
        },
      },
      fallbackOfflineResponse: () => getCostEstimatorOffline(businessType, city, scale, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getCostEstimatorOffline(businessType, city, scale, userProfile);
    }

    setCached(cacheKey, data);
    res.json(data);
  } catch (error: any) {
    res.json(getCostEstimatorOffline(req.body.businessType, req.body.city, req.body.scale, req.body.userProfile));
  }
});

// 5. Low Budget Business Suggestions
app.post('/api/ai/low-budget-ideas', async (req, res) => {
  try {
    const { budgetAmount, userProfile } = req.body;
    const cacheKey = `lowbudget_${budgetAmount}_${userProfile?.preferredLanguage}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json({ ideas: cached });

    const ai = getAiClient();
    const prompt = `Suggest 3 viable businesses that can be started strictly within ₹${budgetAmount} in ${userProfile?.city || 'India'}.
Provide details in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              setupCost: { type: Type.STRING },
              materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
              marketingBudget: { type: Type.STRING },
              monthlyExpenses: { type: Type.STRING },
              expectedMonthlyIncome: { type: Type.STRING },
              expectedMonthlyProfit: { type: Type.STRING },
              breakEvenTime: { type: Type.STRING },
              keySuccessFactor: { type: Type.STRING },
            },
            required: [
              'title',
              'setupCost',
              'materialsNeeded',
              'marketingBudget',
              'monthlyExpenses',
              'expectedMonthlyIncome',
              'expectedMonthlyProfit',
              'breakEvenTime',
              'keySuccessFactor',
            ],
          },
        },
      },
      fallbackOfflineResponse: () => getLowBudgetIdeasOffline(budgetAmount, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getLowBudgetIdeasOffline(budgetAmount, userProfile);
    }

    setCached(cacheKey, data);
    res.json({ ideas: data });
  } catch (error: any) {
    res.json({ ideas: getLowBudgetIdeasOffline(req.body.budgetAmount, req.body.userProfile) });
  }
});

// 6. Marketing Strategy Generator
app.post('/api/ai/marketing-strategy', async (req, res) => {
  try {
    const { businessType, targetAudience, userProfile } = req.body;
    const ai = getAiClient();

    const prompt = `Generate an actionable marketing strategy for a "${businessType}" targeting "${targetAudience || 'local customers'}".
Include Instagram, Facebook, WhatsApp Business, Google Business Profile, Offline tactics, Branding ideas, and Customer Retention plans.
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instagram: { type: Type.ARRAY, items: { type: Type.STRING } },
            facebook: { type: Type.ARRAY, items: { type: Type.STRING } },
            whatsApp: { type: Type.ARRAY, items: { type: Type.STRING } },
            googleBusiness: { type: Type.ARRAY, items: { type: Type.STRING } },
            offline: { type: Type.ARRAY, items: { type: Type.STRING } },
            branding: { type: Type.ARRAY, items: { type: Type.STRING } },
            retention: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['instagram', 'facebook', 'whatsApp', 'googleBusiness', 'offline', 'branding', 'retention'],
        },
      },
      fallbackOfflineResponse: () => getMarketingStrategyOffline(businessType, targetAudience, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getMarketingStrategyOffline(businessType, targetAudience, userProfile);
    }

    res.json(data);
  } catch (error: any) {
    res.json(getMarketingStrategyOffline(req.body.businessType, req.body.targetAudience, req.body.userProfile));
  }
});

// 7. Employee Planner
app.post('/api/ai/employee-plan', async (req, res) => {
  try {
    const { businessType, monthlyTargetRevenue, userProfile } = req.body;
    const ai = getAiClient();

    const prompt = `Recommend an optimal employee hiring plan for a "${businessType}" aiming for ₹${monthlyTargetRevenue || 100000} monthly revenue in ${userProfile?.city || 'India'}.
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEmployees: { type: Type.NUMBER },
            totalMonthlyExpense: { type: Type.NUMBER },
            roles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  count: { type: Type.NUMBER },
                  responsibilities: { type: Type.STRING },
                  salaryPerMonth: { type: Type.NUMBER },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                },
                required: ['role', 'count', 'responsibilities', 'salaryPerMonth', 'priority'],
              },
            },
            aiAdvice: { type: Type.STRING },
          },
          required: ['totalEmployees', 'totalMonthlyExpense', 'roles', 'aiAdvice'],
        },
      },
      fallbackOfflineResponse: () => getEmployeePlanOffline(businessType, monthlyTargetRevenue, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getEmployeePlanOffline(businessType, monthlyTargetRevenue, userProfile);
    }

    res.json(data);
  } catch (error: any) {
    res.json(getEmployeePlanOffline(req.body.businessType, req.body.monthlyTargetRevenue, req.body.userProfile));
  }
});

// 8. Location Advisor
app.post('/api/ai/best-locations', async (req, res) => {
  try {
    const { businessType, city, userProfile } = req.body;
    const ai = getAiClient();

    const prompt = `Suggest the best high-potential locations/hotspots to start a "${businessType}" in ${city || userProfile?.city || 'Hyderabad'}.
Consider customer demand, competition, rent costs, and foot traffic (e.g., Colleges, IT Parks, Railway stations, Malls, Markets, Hospitals).
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              placeType: { type: Type.STRING },
              recommendedAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              customerDemand: { type: Type.STRING, enum: ['High', 'Very High', 'Moderate'] },
              competition: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              estimatedRent: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ['placeType', 'recommendedAreas', 'customerDemand', 'competition', 'estimatedRent', 'reason'],
          },
        },
      },
      fallbackOfflineResponse: () => getLocationAdvisorOffline(businessType, city, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getLocationAdvisorOffline(businessType, city, userProfile);
    }

    res.json({ locations: data });
  } catch (error: any) {
    res.json({ locations: getLocationAdvisorOffline(req.body.businessType, req.body.city, req.body.userProfile) });
  }
});

// 9. Income Goal Planner
app.post('/api/ai/income-goal-plan', async (req, res) => {
  try {
    const { targetIncomeAmount, userProfile } = req.body;
    const ai = getAiClient();

    const prompt = `Explain in detail how the user can earn ₹${targetIncomeAmount || 100000} per month starting from ${userProfile?.city || 'India'}.
Provide best business options, required investment, customers required/month, sales target, expenses, profit, marketing plan, growth roadmap, and key risks to avoid.
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetIncome: { type: Type.STRING },
            bestBusinessOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredInvestment: { type: Type.STRING },
            customersRequiredPerMonth: { type: Type.STRING },
            monthlySalesTarget: { type: Type.STRING },
            monthlyExpenses: { type: Type.STRING },
            expectedProfit: { type: Type.STRING },
            marketingPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
            risksToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'targetIncome',
            'bestBusinessOptions',
            'requiredInvestment',
            'customersRequiredPerMonth',
            'monthlySalesTarget',
            'monthlyExpenses',
            'expectedProfit',
            'marketingPlan',
            'growthRoadmap',
            'risksToAvoid',
          ],
        },
      },
      fallbackOfflineResponse: () => getIncomeGoalPlanOffline(targetIncomeAmount, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getIncomeGoalPlanOffline(targetIncomeAmount, userProfile);
    }

    res.json(data);
  } catch (error: any) {
    res.json(getIncomeGoalPlanOffline(req.body.targetIncomeAmount, req.body.userProfile));
  }
});

// 10. Business Plan Generator
app.post('/api/ai/business-plan', async (req, res) => {
  try {
    const { businessName, category, userProfile } = req.body;
    const ai = getAiClient();

    const prompt = `Generate a full professional Business Plan for "${businessName}" (${category || 'General Business'}) in ${userProfile?.city || 'India'}.
Include Executive Summary, Market Analysis, Competitor Analysis, SWOT Analysis (strengths, weaknesses, opportunities, threats), Marketing Plan, Financial Plan, Growth Strategy, and Risk Analysis.
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            marketAnalysis: { type: Type.STRING },
            competitorAnalysis: { type: Type.STRING },
            swotAnalysis: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
            },
            marketingPlan: { type: Type.STRING },
            financialPlan: { type: Type.STRING },
            growthStrategy: { type: Type.STRING },
            riskAnalysis: { type: Type.STRING },
          },
          required: [
            'title',
            'executiveSummary',
            'marketAnalysis',
            'competitorAnalysis',
            'swotAnalysis',
            'marketingPlan',
            'financialPlan',
            'growthStrategy',
            'riskAnalysis',
          ],
        },
      },
      fallbackOfflineResponse: () => getBusinessPlanOffline(businessName, category, userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getBusinessPlanOffline(businessName, category, userProfile);
    }

    res.json(data);
  } catch (error: any) {
    res.json(getBusinessPlanOffline(req.body.businessName, req.body.category, req.body.userProfile));
  }
});

// 11. Daily Mentor Tip & Motivation
app.post('/api/ai/daily-mentor-tip', async (req, res) => {
  try {
    const { userProfile } = req.body;
    const cacheKey = `daily_tip_${userProfile?.city}_${userProfile?.preferredLanguage}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const ai = getAiClient();
    const prompt = `Provide a daily business tip, a common mistake warning to avoid today, and an encouraging motivational quote for an entrepreneur in ${userProfile?.city || 'India'}.
Respond in ${userProfile?.preferredLanguage || 'English'}.`;

    const result = await safeGenerateContent(ai, {
      primaryModel: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemPersonaPrompt(userProfile),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dailyTip: { type: Type.STRING },
            mistakeWarning: { type: Type.STRING },
            motivationalQuote: { type: Type.STRING },
            growthActionable: { type: Type.STRING },
          },
          required: ['dailyTip', 'mistakeWarning', 'motivationalQuote', 'growthActionable'],
        },
      },
      fallbackOfflineResponse: () => getDailyTipOffline(userProfile),
    });

    let data;
    try {
      data = JSON.parse(result.text);
    } catch (e) {
      data = getDailyTipOffline(userProfile);
    }

    setCached(cacheKey, data);
    res.json(data);
  } catch (error: any) {
    res.json(getDailyTipOffline(req.body.userProfile));
  }
});

// Setup Vite development server or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT) || 3000, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

