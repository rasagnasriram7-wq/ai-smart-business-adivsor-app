// Intelligent Offline Business Knowledge Base Fallback Engine
// Used when Gemini API rate limits (429) or quota limits are encountered.

export const langText = (lang: string = 'English', en: string, te?: string, hi?: string, ta?: string) => {
  const l = (lang || '').toLowerCase();
  if (l.includes('telugu') && te) return te;
  if (l.includes('hindi') && hi) return hi;
  if (l.includes('tamil') && ta) return ta;
  return en;
};

// 1. Daily Mentor Tip Fallback
export const getDailyTipOffline = (userProfile: any) => {
  const lang = userProfile?.preferredLanguage || 'English';
  const city = userProfile?.city || 'your city';

  return {
    dailyTip: langText(
      lang,
      `Focus on customer retention in ${city}! Retaining an existing customer is 5x cheaper than acquiring a new one. Offer a simple loyalty program or WhatsApp updates.`,
      `${city} లో ప్రస్తుత కస్టమర్లను నిలుపుకోవడంపై దృష్టి పెట్టండి! కొత్త వారిని ఆకర్షించడం కంటే పాత కస్టమర్లను నిర్వహించడం 5 రెట్లు చౌక. ఉచిత వాట్సాప్ అప్‌డేట్లు లేదా రివార్డులు ఇవ్వండి.`,
      `${city} में मौजूदा ग्राहकों को बनाए रखने पर ध्यान दें! नए ग्राहक बनाने की तुलना में पुराने ग्राहकों को बनाए रखना 5 गुना सस्ता है। WhatsApp अपडेट या लॉयल्टी कार्ड दें।`
    ),
    mistakeWarning: langText(
      lang,
      `Avoid buying excessive initial stock before validating local demand in ${city}. Start lean, test 3-5 top items, and scale based on sales.`,
      `${city} లో ప్రారంభంలోనే ఎక్కువ స్టాక్ కొనకండి. మొదట 3-5 ముఖ్యమైన ఉత్పత్తులతో ప్రారంభించి, కస్టమర్ల స్పందన చూసి విస్తరించండి.`,
      `शुरुआत में ही भारी मात्रा में स्टॉक खरीदने से बचें। पहले 3-5 मुख्य सामानों के साथ शुरुआत करें और मांग के अनुसार स्टॉक बढ़ाएं।`
    ),
    motivationalQuote: langText(
      lang,
      `"Great things in business are never done by one person; they're done by a team of people." - Steve Jobs`,
      `"వ్యాపారంలో గొప్ప విజయాలు ఒకరి వల్ల కాదు, సమర్థవంతమైన బృందం వల్ల వస్తాయి." - స్టీవ్ జాబ్స్`,
      `"व्यापार में बड़ी सफलता किसी एक व्यक्ति से नहीं, बल्कि एक अच्छी टीम से मिलती है।" - स्टीव जॉब्स`
    ),
    growthActionable: langText(
      lang,
      `Collect contact numbers of 5 happy customers today and send them a polite thank-you message on WhatsApp with your latest offer.`,
      `ఈరోజు 5 మంది సంతృప్తి చెందిన కస్టమర్ల ఫోన్ నంబర్లు సేకరించి, వాట్సాప్‌లో కృతజ్ఞతలు తెలుపుతూ ఆఫర్ పంపండి.`,
      `आज 5 संतुष्ट ग्राहकों के नंबर लें और उन्हें WhatsApp पर धन्यवाद संदेश के साथ नया ऑफर भेजें।`
    ),
  };
};

// 2. AI Chat Response Fallback
export const getChatResponseOffline = (message: string, userProfile: any) => {
  const lang = userProfile?.preferredLanguage || 'English';
  const query = (message || '').toLowerCase();
  const city = userProfile?.city || 'your city';
  const budget = userProfile?.investmentCapacity || userProfile?.monthlyBudget || 100000;

  if (query.includes('lakh') || query.includes('earn') || query.includes('income') || query.includes('profit')) {
    return langText(
      lang,
      `🎯 **Action Plan to Earn ₹1 Lakh Net Monthly Profit in ${city}:**\n\n` +
        `1. **High Margin Business Selection:** Focus on food services, specialty retail, or digital services where gross profit margin is >40%.\n` +
        `2. **Sales Target:** To make ₹1,00,000 net profit at 35% margin, achieve monthly gross sales of ~₹2,85,000 (~₹9,500/day).\n` +
        `3. **Customer Volume:** If average customer ticket size is ₹300, you need only 32 customers per day.\n` +
        `4. **Cost Control:** Keep shop rent under ₹18,000/month and staff salary under ₹25,000/month.\n` +
        `5. **Marketing:** Use Google Business Profile, local WhatsApp groups, and Instagram reels focused on ${city} foodies/shoppers.\n\n` +
        `💡 *Pro Tip:* Use our **P&L Calculator** and **₹1 Lakh Roadmap** tools in the Suite for exact step-by-step numbers!`,
      `🎯 **${city} లో నెలకు ₹1 లక్ష నికర లాభం సంపాదించడానికి కార్యాచరణ ప్రణాళిక:**\n\n` +
        `1. **సరైన వ్యాపార ఎంపిక:** ఆహార సేవలు, రిటైల్ స్టోర్ లేదా డిజిటల్ సేవలను ఎంచుకోండి (మార్జిన్ 40% కంటే ఎక్కువ ఉండాలి).\n` +
        `2. **విక్రయ లక్ష్యం:** నెలకు ₹1,00,000 లాభం రావాలంటే, నెలకు ~₹2,85,000 అమ్మకాలు చేయాలి (రోజుకు ~₹9,500).\n` +
        `3. **కస్టమర్ల సంఖ్య:** సగటున ఒక కస్టమర్ ₹300 ఖర్చు చేస్తే, రోజుకు 32 మంది కస్టమర్లు సరిపోతారు.\n` +
        `4. **ఖర్చుల నియంత్రణ:** దుకాణ అద్దె ₹18,000 లోపు, సిబ్బంది జీతాలు ₹25,000 లోపు ఉండేలా చూసుకోండి.\n` +
        `5. **మార్కెటింగ్:** గూగుల్ బిజినెస్ ప్రొఫైల్, వాట్సాప్ గ్రూప్‌లు మరియు లోకల్ ఇన్‌స్టాగ్రామ్ రీల్స్ ఉపయోగించండి.`
    );
  }

  if (query.includes('idea') || query.includes('start') || query.includes('which business')) {
    return langText(
      lang,
      `💡 **Top High-Potential Business Ideas for ${city} (Budget: ₹${budget.toLocaleString('en-IN')}):**\n\n` +
        `1. **Specialty Tea & Snack Kiosk:** Setup cost ~₹80,000. Daily sales ~₹3,500 with 50% profit margin.\n` +
        `2. **Cloud Kitchen / Delivery Hub:** Setup cost ~₹1.2 Lakhs. High demand via Swiggy/Zomato near college & office zones.\n` +
        `3. **Mobile Electronics & Repair Studio:** Setup cost ~₹1.5 Lakhs. Fast cash flow and high customer return rate.\n` +
        `4. **Organic Grocery & Spice Outlet:** Setup cost ~₹1 Lakh. High demand for unadulterated daily staples.\n\n` +
        `👉 Explore our **Startup Idea Generator** in the Tools tab for detailed breakdown!`,
      `💡 **${city} లో ప్రారంభించడానికి ఉత్తమ వ్యాపార ఆలోచనలు (బడ్జెట్: ₹${budget.toLocaleString('en-IN')}):**\n\n` +
        `1. **టీ & స్నాక్స్ అవుట్‌లెట్:** పెట్టుబడి ~₹80,000. రోజువారీ విక్రయాలు ~₹3,500 (50% లాభం).\n` +
        `2. **క్లౌడ్ కిచెన్ (ఆన్‌లైన్ ఫుడ్):** పెట్టుబడి ~₹1.2 లక్షలు. ఆఫీసులు, కాలేజీల వద్ద మంచి డిమాండ్.\n` +
        `3. **మొబైల్ సర్వీస్ & యాక్సెసరీస్:** పెట్టుబడి ~₹1.5 లక్షలు. వేగవంతమైన రాబడి.\n` +
        `4. **ఆర్గానిక్ నిత్యవసర వస్తువుల దుకాణం:** పెట్టుబడి ~₹1 లక్ష.`
    );
  }

  return langText(
    lang,
    `🤝 **Business Advisory Insight for ${userProfile?.fullName || 'Founder'}:**\n\n` +
      `Regarding your query: "${message}"\n\n` +
      `• **Market Execution:** Focus on validation in ${city} before scaling operations.\n` +
      `• **Financial Discipline:** Keep fixed overheads low. Aim for a 30-40% gross margin.\n` +
      `• **Customer Feedback:** Speak with your first 20 local buyers directly to refine product quality.\n` +
      `• **Growth Tip:** Use digital marketing (Google Maps listing & WhatsApp catalog) to drive local footfall.\n\n` +
      `Feel free to ask specific questions about cost breakdown, marketing, location, or employee planning!`,
    `🤝 **${userProfile?.fullName || 'మిత్రమా'} కి వ్యాపార సలహా:**\n\n` +
      `మీ ప్రశ్న: "${message}"\n\n` +
      `• **అమలు ప్రణాళిక:** ${city} లో మార్కెట్ డిమాండ్ పరీక్షించిన తర్వాత విస్తరించండి.\n` +
      `• **ఆర్థిక క్రమశిక్షణ:** స్థిర ఖర్చులను తగ్గించుకోండి. 30-40% లాభదాయకత లక్ష్యంగా పెట్టుకోండి.\n` +
      `• **కస్టమర్ అభిప్రాయం:** మొదటి 20 మంది కస్టమర్ల అభిప్రాయాలు సేకరించి మెరుగుపరచండి.\n` +
      `• **వృద్ధి మార్గం:** గూగుల్ మ్యాప్స్ మరియు వాట్సాప్ బిజినెస్ ఉపయోగించి ఎక్కువ మంది కస్టమర్లను ఆకర్షించండి.`
  );
};

// 3. Startup Ideas Fallback
export const getStartupIdeasOffline = (budget: number, skills: string, location: string, interests: string, userProfile: any) => {
  const b = budget || userProfile?.investmentCapacity || 100000;
  const loc = location || userProfile?.city || 'India';
  const lang = userProfile?.preferredLanguage || 'English';

  return [
    {
      id: 'idea-1',
      title: langText(lang, 'Specialty Tea & Quick Bite Outlet', 'స్పెషాలిటీ టీ & స్నాక్స్ పాయింట్', 'टी एवं स्नैक्स आउटलेट'),
      category: 'Food & Beverage',
      investmentRequired: `₹${Math.round(b * 0.6).toLocaleString('en-IN')}`,
      difficulty: 'Easy',
      monthlyIncomeEstimate: '₹90,000 - ₹1,20,000',
      profitEstimate: '₹40,000 - ₹55,000',
      risks: ['High local tea stall competition', 'Milk & raw material price fluctuations'],
      growthOpportunities: ['Franchise expansion across city', 'Catering for local offices'],
      description: `A modern hygienic tea and snack kiosk in ${loc} serving kulhad chai, samosas, and Osmania biscuits with clean seating.`,
      targetAudience: 'Students, IT professionals, commuters, and local shoppers',
    },
    {
      id: 'idea-2',
      title: langText(lang, 'Cloud Kitchen & Tiffin Delivery', 'క్లౌడ్ కిచెన్ & టిఫిన్ డెలివరీ', 'क्लाउड किचन एवं टिफिन डिलीवरी'),
      category: 'Food Tech',
      investmentRequired: `₹${Math.round(b * 0.85).toLocaleString('en-IN')}`,
      difficulty: 'Medium',
      monthlyIncomeEstimate: '₹1,20,000 - ₹1,80,000',
      profitEstimate: '₹50,000 - ₹75,000',
      risks: ['Swiggy/Zomato commission costs', 'Food quality consistency'],
      growthOpportunities: ['Corporate meal subscription plans', 'Party catering'],
      description: `Home-style hygienic meals and lunch boxes delivered via online apps and monthly subscriptions in ${loc}.`,
      targetAudience: 'Bachelor employees, hostel students, and busy working couples',
    },
    {
      id: 'idea-3',
      title: langText(lang, 'Mobile Accessories & Fast Repair Hub', 'మొబైల్ సర్వీసింగ్ & యాక్సెసరీస్', 'मोबाइल एक्सेसरीज एवं रिपेयर सेंटर'),
      category: 'Retail & Services',
      investmentRequired: `₹${Math.round(b * 0.75).toLocaleString('en-IN')}`,
      difficulty: 'Easy',
      monthlyIncomeEstimate: '₹80,000 - ₹1,40,000',
      profitEstimate: '₹35,000 - ₹60,000',
      risks: ['Rapid smartphone model changes', 'Warranty claim issues'],
      growthOpportunities: ['Refurbished phone trading', 'Doorstep screen replacement service'],
      description: `Fast 30-minute phone screen replacement, tempered glass, charger sales, and custom mobile skin application in ${loc}.`,
      targetAudience: 'Youth, smartphone owners, and local residents',
    },
    {
      id: 'idea-4',
      title: langText(lang, 'Digital Marketing & WhatsApp Agency', 'డిజిటల్ మార్కెటింగ్ & వాట్సాప్ ఏజెన్సీ', 'डिजिटल मार्केटिंग एजेंसी'),
      category: 'B2B Services',
      investmentRequired: `₹${Math.round(b * 0.3).toLocaleString('en-IN')}`,
      difficulty: 'Medium',
      monthlyIncomeEstimate: '₹60,000 - ₹1,50,000',
      profitEstimate: '₹45,000 - ₹1,10,000',
      risks: ['Client retention challenges', 'Keeping up with platform algorithms'],
      growthOpportunities: ['AI tool integration for clients', 'Monthly retainer packages'],
      description: `Helping small shops and doctors in ${loc} set up Google Maps listings, Instagram reels, and WhatsApp automation.`,
      targetAudience: 'Local shop owners, doctors, clinics, schools, and real estate agents',
    },
  ];
};

// 4. Execution Plan Fallback
export const getExecutionPlanOffline = (businessTitle: string, userProfile: any) => {
  const b = userProfile?.investmentCapacity || 100000;
  const city = userProfile?.city || 'India';
  const lang = userProfile?.preferredLanguage || 'English';

  return {
    timelineWeeks: '6 to 8 Weeks',
    totalBudgetEstimate: `₹${b.toLocaleString('en-IN')}`,
    steps: [
      {
        phase: 'Phase 1 (Weeks 1-2)',
        task: 'Market Research & Registration',
        details: `Survey top locations in ${city}, acquire GST registration, Udyam Aadhar, and FSSAI license if food related.`,
      },
      {
        phase: 'Phase 2 (Weeks 3-4)',
        task: 'Location Finalization & Lease',
        details: 'Finalize high-footfall shop premises (100-250 sq.ft) with rental agreement advance.',
      },
      {
        phase: 'Phase 3 (Weeks 5-6)',
        task: 'Equipment Purchase & Interiors',
        details: 'Procure counter tables, billing POS machine, display racks, and basic branding signage.',
      },
      {
        phase: 'Phase 4 (Weeks 7-8)',
        task: 'Trial Run & Grand Opening',
        details: 'Conduct 3-day soft launch with friends/family, distribute flyers, launch WhatsApp campaign, and go live.',
      },
    ],
    requiredEquipment: [
      'Billing Counter & POS Tablet/Printer',
      'Display Racks / Refrigerator / Kitchen setup',
      'LED Glow Signboard & Interior Lighting',
      'CCTV Camera Security System',
    ],
    licensesAndPermits: [
      'Udyam MSME Registration (Free)',
      'GST Registration Number',
      'Shop & Establishment Act Permit',
      'FSSAI Food License (If F&B business)',
    ],
    marketingPlanSummary: `Distribute 2,000 local pamphlets near ${city} junctions, set up Google Business Profile for reviews, and run ₹100/day localized Instagram ads.`,
    hiringPlanSummary: 'Hire 1 experienced Lead Technician/Chef and 1 Helper for daily store operations.',
    successTips: [
      'Keep store spotless and well-lit at all times.',
      'Offer introductory 10% discount during opening week.',
      'Always collect customer phone numbers for WhatsApp re-marketing.',
    ],
  };
};

// 5. Cost Estimator Fallback
export const getCostEstimatorOffline = (businessType: string, city: string, scale: string, userProfile: any) => {
  const loc = city || userProfile?.city || 'Hyderabad';
  const isTier1 = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai'].some((c) => loc.toLowerCase().includes(c));
  const baseMultiplier = isTier1 ? 1.2 : 0.85;

  const rent = Math.round(35000 * baseMultiplier);
  const furniture = Math.round(40000 * baseMultiplier);
  const equipment = Math.round(50000 * baseMultiplier);
  const materials = Math.round(30000 * baseMultiplier);
  const licensing = 8000;
  const marketing = Math.round(12000 * baseMultiplier);
  const misc = 15000;

  const total = rent + furniture + equipment + materials + licensing + marketing + misc;

  return {
    totalInvestment: total,
    breakdown: [
      { name: 'Shop Rent & Advance Deposit', amount: rent, description: `2-month advance deposit for retail shop in ${loc}` },
      { name: 'Interior & Furniture Work', amount: furniture, description: 'Counters, shelving racks, lights, and customer seating' },
      { name: 'Core Equipment & Machines', amount: equipment, description: 'Primary machinery, refrigerators, or POS system' },
      { name: 'Initial Raw Materials & Stock', amount: materials, description: 'First month inventory stock to start operations' },
      { name: 'Licensing & Government Permits', amount: licensing, description: 'FSSAI, GST, MSME, and Shop Act registration' },
      { name: 'Grand Opening & Marketing', amount: marketing, description: 'Signboard, flyers, and local Instagram promotion' },
      { name: 'Working Capital & Emergency Buffer', amount: misc, description: 'Reserve for initial electricity, internet, and unexpected expenses' },
    ],
    cityNotes: `Rental estimates are based on commercial market averages in ${loc}. Expect 10-15% variance depending on exact main road access.`,
    aiTip: `Negotiate with landlord for a 15-day rent-free period during interior setup to save upfront cashflow!`,
  };
};

// 6. Low Budget Ideas Fallback
export const getLowBudgetIdeasOffline = (budgetAmount: number, userProfile: any) => {
  const b = budgetAmount || 50000;
  const loc = userProfile?.city || 'India';

  return [
    {
      title: 'Mobile Food / Tea Cart',
      setupCost: `₹${Math.round(b * 0.7).toLocaleString('en-IN')}`,
      materialsNeeded: ['Stainless steel cart', 'Gas stove & cylinders', 'Utensils', 'Paper cups & packaging'],
      marketingBudget: '₹1,500 (Banners & WhatsApp)',
      monthlyExpenses: '₹18,000 (Ingredients & gas)',
      expectedMonthlyIncome: '₹55,000',
      expectedMonthlyProfit: '₹37,000',
      breakEvenTime: '1.5 Months',
      keySuccessFactor: 'Hygiene, speed of service, and high-footfall location near offices or colleges',
    },
    {
      title: 'Doorstep Car / Bike Washing Service',
      setupCost: `₹${Math.round(b * 0.5).toLocaleString('en-IN')}`,
      materialsNeeded: ['High pressure washer pump', 'Car shampoo & microfibers', 'Extension power cable', 'Water bucket'],
      marketingBudget: '₹2,000 (Pamphlets in gated apartments)',
      monthlyExpenses: '₹6,000 (Consumables & fuel)',
      expectedMonthlyIncome: '₹45,000',
      expectedMonthlyProfit: '₹39,000',
      breakEvenTime: '1 Month',
      keySuccessFactor: 'Monthly apartment subscription bundles and punctual morning timing',
    },
    {
      title: 'Home-based Homemade Pickle & Spice Brand',
      setupCost: `₹${Math.round(b * 0.4).toLocaleString('en-IN')}`,
      materialsNeeded: ['Glass jars & custom labels', 'Bulk raw spices & oil', 'Sealing machine', 'FSSAI basic license'],
      marketingBudget: '₹2,500 (Samples for WhatsApp groups)',
      monthlyExpenses: '₹12,000 (Raw materials)',
      expectedMonthlyIncome: '₹40,000',
      expectedMonthlyProfit: '₹28,000',
      breakEvenTime: '1 Month',
      keySuccessFactor: 'Authentic traditional recipe taste and word-of-mouth customer referrals',
    },
  ];
};

// 7. Marketing Strategy Fallback
export const getMarketingStrategyOffline = (businessType: string, targetAudience: string, userProfile: any) => {
  const loc = userProfile?.city || 'India';

  return {
    instagram: [
      `Post 3 reel videos weekly showing behind-the-scenes creation of your ${businessType} products.`,
      `Partner with 2 local micro-influencers in ${loc} for food/product reviews in exchange for free samples.`,
      `Run targeted Instagram ads (₹150/day) restricted to a 5 km radius around your location.`,
    ],
    facebook: [
      `Post daily in ${loc} Buy/Sell and Community Facebook groups with special offers.`,
      `Set up Facebook Shop catalog with clear pricing and direct WhatsApp order button.`,
    ],
    whatsApp: [
      `Install WhatsApp Business and set up automated greeting & quick reply product catalog.`,
      `Broadcast weekly weekend deals to your saved customer contact list.`,
      `Offer ₹50 discount for customers who post your product on their WhatsApp Status!`,
    ],
    googleBusiness: [
      `Register Google Business Profile with exact GPS pin location and photos.`,
      `Ask every satisfied customer to scan your QR code and leave a 5-star review.`,
      `Upload new photos of store stock and menu every week to stay top-ranked on Google Maps.`,
    ],
    offline: [
      `Distribute 1,000 bright printed pamphlets inside morning local newspapers.`,
      `Place an eye-catching LED glow standee outside your shop on the main street.`,
      `Tie up with nearby complimentary shops (e.g., salon + clothing store cross-discounts).`,
    ],
    branding: [
      `Use clean eco-friendly paper bags with custom logo stamp and phone number.`,
      `Include a thank-you coupon card inside every package for the customer's next visit.`,
    ],
    retention: [
      `Digital punch card: 5th purchase gets a free gift/drink!`,
      `Send birthday/anniversary greeting messages on WhatsApp with exclusive 15% off discount.`,
    ],
  };
};

// 8. Employee Plan Fallback
export const getEmployeePlanOffline = (businessType: string, monthlyTargetRevenue: number, userProfile: any) => {
  const rev = monthlyTargetRevenue || 150000;

  return {
    totalEmployees: 2,
    totalMonthlyExpense: 26000,
    roles: [
      {
        role: 'Store Manager / Senior Technician',
        count: 1,
        responsibilities: 'Oversee daily store sales, customer interactions, inventory management, and billing.',
        salaryPerMonth: 16000,
        priority: 'High',
      },
      {
        role: 'Operations Helper / Delivery Staff',
        count: 1,
        responsibilities: 'Assist with stock packing, store cleaning, local order delivery, and errands.',
        salaryPerMonth: 10000,
        priority: 'High',
      },
    ],
    aiAdvice: `Keep wage expense around 15-20% of gross revenue (₹${Math.round(rev * 0.18).toLocaleString('en-IN')}). Offer a ₹1,000 monthly performance bonus if target sales are exceeded to boost staff motivation!`,
  };
};

// 9. Location Advisor Fallback
export const getLocationAdvisorOffline = (businessType: string, city: string, userProfile: any) => {
  const loc = city || userProfile?.city || 'Hyderabad';

  return [
    {
      placeType: 'Colleges & Educational Hubs',
      recommendedAreas: [`Near major universities and coaching centers in ${loc}`],
      customerDemand: 'Very High',
      competition: 'Medium',
      estimatedRent: '₹15,000 - ₹25,000 / mo',
      reason: 'Constant high youth footfall, impulse buying, and viral word-of-mouth potential.',
    },
    {
      placeType: 'IT Parks & Commercial Office Zones',
      recommendedAreas: [`Commercial tech corridors & office complexes in ${loc}`],
      customerDemand: 'High',
      competition: 'High',
      estimatedRent: '₹25,000 - ₹45,000 / mo',
      reason: 'High purchasing power, high lunch/evening snack orders, and corporate group sales.',
    },
    {
      placeType: 'Main Market & Railway Station Road',
      recommendedAreas: [`Central shopping street & transport transit points in ${loc}`],
      customerDemand: 'Very High',
      competition: 'High',
      estimatedRent: '₹20,000 - ₹35,000 / mo',
      reason: 'Mass daily foot traffic from commuters, shoppers, and local residents.',
    },
  ];
};

// 10. Income Goal Plan Fallback
export const getIncomeGoalPlanOffline = (targetIncomeAmount: number, userProfile: any) => {
  const target = targetIncomeAmount || 100000;
  const loc = userProfile?.city || 'India';

  return {
    targetIncome: `₹${target.toLocaleString('en-IN')} / month (Net Profit)`,
    bestBusinessOptions: [
      `Specialty Cafe & Fast Food Joint in ${loc}`,
      `Mobile Phone Accessories & Gadgets Store`,
      `Cloud Kitchen & Corporate Meal Box Service`,
      `Digital Marketing & E-Commerce Service Agency`,
    ],
    requiredInvestment: '₹1.5 Lakhs to ₹2.5 Lakhs',
    customersRequiredPerMonth: '350 to 500 customers (12 to 16 per day)',
    monthlySalesTarget: `₹2,50,000 (Assuming 40% net margin to reach ₹${target.toLocaleString('en-IN')} net profit)`,
    monthlyExpenses: 'Rent: ₹20k, Staff: ₹25k, Raw Materials: ₹95k, Electricity/Misc: ₹10k',
    expectedProfit: `₹${target.toLocaleString('en-IN')} / month`,
    marketingPlan: [
      `Google Maps Optimization to rank in top 3 local searches in ${loc}.`,
      `WhatsApp marketing catalog sent to 500 local contacts.`,
      `First month Buy-1-Get-1 offer to build immediate customer momentum.`,
    ],
    growthRoadmap: [
      'Month 1-3: Establish consistent daily sales and break-even.',
      'Month 4-6: Achieve ₹1 Lakh net monthly profit with repeat buyers.',
      'Month 7-12: Launch second outlet or cloud unit in neighboring area.',
    ],
    risksToAvoid: [
      'Avoid high rent contracts (>25% of projected revenue).',
      'Never compromise on food/service quality after initial launch.',
      'Do not offer excessive credit (khatta/udhaar) to local buyers.',
    ],
  };
};

// 11. Business Plan Fallback
export const getBusinessPlanOffline = (businessName: string, category: string, userProfile: any) => {
  const name = businessName || 'My Startup Venture';
  const cat = category || userProfile?.businessCategory || 'General Retail & Services';
  const loc = userProfile?.city || 'India';

  return {
    title: `Comprehensive Business Plan: ${name}`,
    executiveSummary: `${name} is a high-growth ${cat} enterprise operating in ${loc}. Designed to serve local demand with superior quality, competitive pricing, and modern customer experience.`,
    marketAnalysis: `The market for ${cat} in ${loc} is experiencing 15%+ annual growth driven by rising urbanization, disposable incomes, and demand for reliable local services.`,
    competitorAnalysis: `Primary competition includes traditional unorganized local vendors. ${name} differentiates through hygiene, transparent digital billing, WhatsApp ordering, and fast customer service.`,
    swotAnalysis: {
      strengths: ['Low overhead cost model', 'Personalized customer service', 'Digital payment & WhatsApp catalog integration'],
      weaknesses: ['New brand awareness in early months', 'Dependency on reliable local suppliers'],
      opportunities: ['Expanding to delivery apps (Swiggy/Zomato)', 'Corporate tie-ups and bulk orders'],
      threats: ['Entry of aggressive nearby competitors', 'Fluctuations in raw material prices'],
    },
    marketingPlan: `Utilize Google Business Profile, WhatsApp re-marketing, local newspaper pamphlet inserts, and localized Instagram reels targeting ${loc}.`,
    financialPlan: `Initial Capital: ₹${(userProfile?.investmentCapacity || 150000).toLocaleString('en-IN')}. Monthly Revenue Projection: ₹2,20,000. Net Margin: 35-40%. Estimated Payback Period: 5 months.`,
    growthStrategy: `Phase 1: Build local brand dominance in ${loc}.\nPhase 2: Introduce loyalty program & subscription bundles.\nPhase 3: Franchise & open secondary unit.`,
    riskAnalysis: `Risk: Initial low footfall. Mitigation: Launch aggressive inaugural promotional offers and local influencer endorsements.`,
  };
};
